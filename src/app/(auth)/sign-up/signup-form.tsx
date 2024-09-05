"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import { Loader } from "lucide-react";

export default function SignUpForm() {
  const [data, action] = useFormState(signUp, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Регистриране..." : "Регистрирай се"}
        {pending && <Loader className="animate-spin" />}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Име</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            type="text"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Имейл</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Парола</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Повторете паролата</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {!data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Вече имате акаунт?{" "}
          <Link
            target="_self"
            className="link text-black dark:text-white hover:underline"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Влезте
          </Link>
        </div>
      </div>
    </form>
  );
}
