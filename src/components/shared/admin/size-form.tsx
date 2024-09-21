"use client";

import { Button } from "@/components/ui/button";
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
import { createColor, updateColor } from "@/lib/actions/color.actions";
import { createSize, updateSize } from "@/lib/actions/size.actions";
import { SizeDefaultValues } from "@/lib/constants";
import { sizeSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateSizeForm({
  size,
  type,
}: {
  size?: Size | null;
  type: "Create" | "Update";
}) {
  const router = useRouter();

  if (!size && type === "Update") {
    router.push("/admin/colors");
  }

  const form = useForm<z.infer<typeof sizeSchema>>({
    resolver: zodResolver(sizeSchema),
    defaultValues: type === "Update" ? { ...size } : SizeDefaultValues,
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof sizeSchema>) {
    let res;
    if (type === "Create") {
      res = await createSize(values);
    }
    if (type === "Update") {
      res = await updateSize(values!);
    }

    if (!res?.success) {
      toast({
        variant: "destructive",
        description: res?.message,
      });
    } else {
      toast({
        description: res?.message,
      });
      router.push("/admin/sizes");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="id"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormLabel>ИД</FormLabel>
                  <FormControl>
                    <Input
                      disabled={size?.id}
                      placeholder="Въведете ид"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormLabel>Име</FormLabel>
                  <FormControl>
                    <Input placeholder="Въведете името на размера" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? "Добавяне..."
              : type === "Create"
              ? "Добави размер"
              : type === "Update"
              ? "Промени размер"
              : " "}
          </Button>
        </form>
      </Form>
    </>
  );
}
