"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { insertHeroSection, updateHeroSection } from "@/lib/validators";
import { HeroSection } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createHeroData,
  imageRemove,
  updateHeroData,
} from "@/lib/actions/hero-section.actions";
import { XCircleIcon } from "lucide-react";
import { HeroSectionDefaultValues } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";

type CreateFormValues = z.infer<typeof insertHeroSection>;
type UpdateFormValues = z.infer<typeof updateHeroSection>;

export default function HeroSectionDataForm({
  type,
  section,
}: {
  type: "Create" | "Update";
  section?: HeroSection & { images: { image: string; imageKey: string }[] };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateFormValues | UpdateFormValues>({
    resolver: zodResolver(
      type === "Create" ? insertHeroSection : updateHeroSection
    ),
    defaultValues:
      type === "Update"
        ? {
            ...section,
          }
        : HeroSectionDefaultValues,
  });

  const { setValue } = form;

  const onSubmit = async (values: CreateFormValues | UpdateFormValues) => {
    if (type === "Create") {
      const res = await createHeroData(values as CreateFormValues);
      if (res.success) {
        toast({ description: res.message });
        router.push("/admin/hero-section");
      } else {
        toast({ variant: "destructive", description: res.message });
      }
    } else {
      const res = await updateHeroData(values as UpdateFormValues);
      if (res.success) {
        toast({ description: res.message });
        router.push("/admin/hero-section");
      } else {
        toast({ variant: "destructive", description: res.message });
      }
    }
  };

  const handleDeleteImage = async (index: number, imageKey: string) => {
    const res = await imageRemove(imageKey);
    if (res.success) {
      toast({ description: res.message });

      const currentImages = form.getValues("images") || [];
      const updatedImages = currentImages.filter((_, i) => i !== index);

      setValue("images", updatedImages);
    } else {
      toast({ variant: "destructive", description: res.message });
    }
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Изображения</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex flex-wrap gap-2">
                      {(field.value || []).map((image, index) => (
                        <div key={index} className="relative w-40 h-40">
                          <Image
                            src={image.image}
                            alt={`Hero image ${index + 1}`}
                            fill
                            className="object-cover rounded-sm"
                          />
                          <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteImage(index, image.imageKey)
                            }
                          >
                            <XCircleIcon
                              size={28}
                              className="absolute top-0 right-0 text-red-600 m-1"
                            />
                          </button>
                        </div>
                      ))}
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setValue("images", [
                            ...(field.value || []),
                            { image: res[0].url, imageKey: res[0].key },
                          ]);
                        }}
                        onUploadError={(error) => {
                          toast({
                            variant: "destructive",
                            description: `Upload error: ${error.message}`,
                          });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormLabel>Активен</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Въведете описание за началната страница"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? "Създаване..."
              : `${type === "Create" ? "Добави" : "Промени"}`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
