// OLD LOGIN PAGE DESIGN

"use client";

import { loginAction } from "@/app/_lib/actions";
import { useActionState, useEffect } from "react";
import FormInput from "../../_components/ui/FormInput";
import PanelTitle from "../../_components/ui/PanelTitle";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Successfully logged in!");
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
          Log in
        </PanelTitle>
        <FormInput
          name="email"
          id="email"
          label="Email Address"
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="p-2 pl-5"
        />

        <FormInput
          name="password"
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="p-2 pl-5"
        />

        {state?.error && (
          <p className="mt-2 text-center text-sm text-red-700">{state.error}</p>
        )}

        <div className="text-brand mx-1 flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <input type="checkbox" id="keep-logged" name="keep-logged" />
            <label htmlFor="keep-logged">Keep me logged in</label>
          </div>

          <button
            type="button"
            className="hover:text-brand-light cursor-pointer underline"
          >
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand disabled:bg-brand-light hover:bg-brand-light active:bg-brand-light mt-5 cursor-pointer rounded-3xl p-3 text-white transition-all hover:scale-[0.98] active:scale-[0.96] disabled:scale-[0.96] disabled:cursor-wait"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
        <p className="text-brand text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="hover:text-brand-light cursor-pointer underline"
          >
            Sign up{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}
