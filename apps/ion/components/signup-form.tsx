"use client";

import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { signUp } from "@ion/auth/client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <FlaskConical className="size-6" />
              </div>
              <span className="sr-only">Ion</span>
            </Link>
            <h1 className="text-xl font-bold">Create an account</h1>
            <FieldDescription>
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" required />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <SocialLoginButtons />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
