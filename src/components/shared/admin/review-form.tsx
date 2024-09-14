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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createUserReview } from "@/lib/actions/user-reviews.actions";
import { UserReviewDefaultValues } from "@/lib/constants";
import { insertUserReviewSchema } from "@/lib/validators";
import { UserReview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateReviewForm({
  review,
  userId,
}: {
  review?: UserReview;
  userId?: string | null;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertUserReviewSchema>>({
    resolver: zodResolver(insertUserReviewSchema),
    defaultValues: UserReviewDefaultValues,
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof insertUserReviewSchema>) {
    const res = await createUserReview(values);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      router.push(`/admin/user-reviews`);
    }
  }

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
            name="fullName"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Име</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете своето име/на" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Град</FormLabel>
                <FormControl>
                  <Input placeholder="Въведете своят град" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Рейтинг</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Въведете рейтинг (1-5)"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Заглавие</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Въведете заглавието на ревюто"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="text"
          render={({ field }: { field: any }) => (
            <FormItem className="w-full">
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Въведете описанието на ревюто"
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
            {form.formState.isSubmitting ? "Създаване..." : "Създай"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
