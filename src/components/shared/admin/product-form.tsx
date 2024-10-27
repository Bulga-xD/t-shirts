"use client";

import slugify from "slugify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ColorType, Product, SizeType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductForm({
  type,
  product,
  productId,
  colors,
  sizes,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
  colors: ColorType[];
  sizes: SizeType[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues: product
      ? {
          ...product,
          price: Number(product.price),
          discount: Number(product.discount),
          productVariants: product.productVariants.map((pv) => ({
            id: pv.id,
            sizeId: pv.sizeId,
            colorId: pv.colorId,
            stock: pv.stock,
          })),
        }
      : productDefaultValues,
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof insertProductSchema>) {
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/products`);
      }
    }
    if (type === "Update") {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }
      const res = await updateProduct({ ...values, id: productId });
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        router.push(`/admin/products`);
      }
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productVariants",
  });

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-5"
      >
        <div className="flex flex-wrap gap-2 items-center">
          <FormLabel>Варианти</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mt-2">
              <FormField
                control={form.control}
                name={`productVariants.${index}.sizeId`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Изберете размер" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`productVariants.${index}.colorId`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Изберете цвят" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.id} value={color.id}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`productVariants.${index}.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Наличност" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => remove(index)}>
                Премахни
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ sizeId: "", colorId: "", stock: 0 })}
            className="mt-2"
          >
            Добави вариант
          </Button>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Име</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете име на продукта" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Слъг</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Въведете уникален слъг за продукта"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        );
                      }}
                    >
                      Генерирай слъг
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете категория" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Марка</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете марка" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => {
              const currentValues = field.value || []; // Default to empty array

              const isChecked = (id: string) =>
                currentValues.some((value) => value.id === id);

              return (
                <FormItem className="w-full">
                  <div className="mb-4">
                    <FormLabel className="text-base">Размери</FormLabel>
                  </div>
                  <div className="flex flex-row flex-wrap items-center space-x-3">
                    {sizes.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-1 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked(item.id)}
                            onCheckedChange={(checked) => {
                              const updatedValues = checked
                                ? [
                                    ...currentValues,
                                    { id: item.id, label: item.label },
                                  ]
                                : currentValues.filter(
                                    (value) => value.id !== item.id
                                  );
                              field.onChange(updatedValues);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => {
              const currentValues = field.value || []; // Default to empty array

              const isChecked = (id: string) =>
                currentValues.some((value) => value.id === id);

              return (
                <FormItem className="w-full">
                  <div className="mb-4">
                    <FormLabel className="text-base">Цветове</FormLabel>
                  </div>
                  <div className="flex flex-row flex-wrap items-center space-x-3">
                    {colors.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-1 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked(item.id)}
                            onCheckedChange={(checked) => {
                              const updatedValues = checked
                                ? [
                                    ...currentValues,
                                    { id: item.id, label: item.label },
                                  ]
                                : currentValues.filter(
                                    (value) => value.id !== item.id
                                  );
                              field.onChange(updatedValues);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div> */}

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Цена</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Въведете цена на продукта"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Цена след намаление</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Въведете цанa на намалението"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="stock"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Наличност</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Въведете наличност на продукта"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Изображения</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: any) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          Продукт на фокус
          <Card>
            <CardContent className="space-y-2 mt-2  ">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>На фокус?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className=" w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: "destructive",
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Въведете описание на продукта"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? "Създаване..."
              : `${type === "Create" ? "Добави" : "Промени"} Продукт `}
          </Button>
        </div>
      </form>
    </Form>
  );
}
