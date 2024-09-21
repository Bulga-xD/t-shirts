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
import { ColorDefaultValues } from "@/lib/constants";
import { colorSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateColorForm({
  color,
  type,
}: {
  color?: Color | null;
  type: "Create" | "Update";
}) {
  const router = useRouter();

  if (!color && type === "Update") {
    router.push("/admin/colors");
  }

  const form = useForm<z.infer<typeof colorSchema>>({
    resolver: zodResolver(colorSchema),
    defaultValues: type === "Update" ? { ...color } : ColorDefaultValues,
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof colorSchema>) {
    let res;
    if (type === "Create") {
      res = await createColor(values);
    }
    if (type === "Update") {
      res = await updateColor(values!);
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
      router.push("/admin/colors");
    }
  }

  return (
    <>
      <p className="text-sm text-muted-foreground italic">
        *ВАЖНО! ID-то е цвета на латиница, а името е цвета на кирилица
      </p>
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
                      disabled={color?.id}
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
                    <Input placeholder="Въведете името на цвета" {...field} />
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
              ? "Добави"
              : type === "Update"
              ? "Промени"
              : "цвят"}
            {" цвят"}
          </Button>
        </form>
      </Form>
    </>
  );
}
