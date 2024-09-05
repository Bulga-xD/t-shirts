"use client";

import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validators";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null;
}) {
  const router = useRouter();
  const { items } = useCart();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      router.push("/payment-method");
    });
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <section className="max-w-7xl m-auto p-5 md:px-10">
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Адрес за доставка</h1>
        <p className="text-sm text-muted-foreground">
          Моля въведете адрес за доставка
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Име и фамилия</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Въведете име и фамилия..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="Въведете адрес..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Град</FormLabel>
                    <FormControl>
                      <Input placeholder="Въведете град..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Държава</FormLabel>
                    <FormControl>
                      <Input placeholder="Въведете държава..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Пощенски код</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Въведете пощенски код..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Към плащане
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
