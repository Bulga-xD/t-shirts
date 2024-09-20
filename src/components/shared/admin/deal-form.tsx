"use client";

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
import { MonthlyDealDefaultValues } from "@/lib/constants";
import {
  insertMonthlyDealSchema,
  updateMonthlyDealSchema,
} from "@/lib/validators";
import { MonthlyDeal } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createDeal, updateDeal } from "@/lib/actions/monthly-deals.actions";
import { DatePicker } from "../datepicker";

export default function MonthlyDealForm({
  type,
  deal,
  dealId,
}: {
  type: "Create" | "Update";
  deal?: MonthlyDeal;
  dealId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertMonthlyDealSchema>>({
    resolver:
      type === "Create"
        ? zodResolver(insertMonthlyDealSchema)
        : zodResolver(updateMonthlyDealSchema),
    defaultValues: deal
      ? {
          ...deal,
          endDate: new Date(deal.endDate), // Convert string to Date object
        }
      : {
          ...MonthlyDealDefaultValues,
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default to 5 days from now
        },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof insertMonthlyDealSchema>) {
    if (type === "Create") {
      const res = await createDeal(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/monthly-deals`);
      }
    }
    if (type === "Update") {
      if (!dealId) {
        router.push(`/admin/monthly-deals`);
        return;
      }
      const res = await updateDeal({ ...values, id: dealId });
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        router.push(`/admin/monthly-deals`);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div>
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Крайна дата на промоцията</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Изображение</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {field.value && (
                        <Image
                          src={field.value || ""}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      )}

                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: any) => {
                            form.setValue("image", res[0].url);
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

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Въведете описание на офертата"
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
              : `${type === "Create" ? "Добави" : "Промени"} Продукт `}
          </Button>
        </div>
      </form>
    </Form>
  );
}
