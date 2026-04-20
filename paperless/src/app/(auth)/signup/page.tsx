"use client";

import Link from "next/link";
import FormInput from "../../_components/ui/FormInput";
import PanelTitle from "../../_components/ui/PanelTitle";
import { useActionState, useEffect } from "react";
import { signUpAction } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Account successfully created!");
      if (state.redirectTo) {
        router.replace(state.redirectTo);
      }
    }
  }, [state, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <form
        action={formAction}
        className="animate-slide-up bg-background flex h-full w-full flex-col justify-center gap-4 rounded-lg p-10 shadow-2xl sm:h-auto sm:w-[70%] md:w-[50%]"
      >
        <PanelTitle level={1} className="mb-4">
          Sign Up
        </PanelTitle>
        <div className="flex gap-3">
          <FormInput
            name="firstName"
            id="firstName"
            label="First Name"
            type="text"
            placeholder="First Name"
            autoComplete="given-name"
            className="p-2 pl-5"
            defaultValue={state?.fields?.firstName || ""}
          />
          <FormInput
            name="lastName"
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="Last Name"
            autoComplete="family-name"
            className="p-2 pl-5"
            defaultValue={state?.fields?.lastName || ""}
          />
        </div>

        <FormInput
          name="email"
          id="email"
          label="Email Address"
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="p-2 pl-5"
          defaultValue={state?.fields?.email || ""}
        />

        <FormInput
          name="password"
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="p-2 pl-5"
        />

        <FormInput
          name="confirmPassword"
          id="confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          className="p-2 pl-5"
        />

        {state?.error && (
          <p
            className="mt-2 text-center text-sm font-medium text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-brand disabled:bg-brand-light hover:bg-brand-light active:bg-brand-light mt-5 cursor-pointer rounded-3xl p-3 text-white transition-all hover:scale-[0.98] active:scale-[0.96] disabled:scale-[0.96] disabled:cursor-wait"
        >
          {isPending ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-brand text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="hover:text-brand-light cursor-pointer underline"
          >
            Log in{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}
