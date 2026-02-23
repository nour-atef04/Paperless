"use client";

import { loginAction } from "@/app/_lib/actions";
import { useActionState } from "react";
import FormInput from "../../_components/ui/FormInput";
import PanelTitle from "../../_components/ui/PanelTitle";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <form
        action={formAction}
        className="animate-slide-up bg-background flex h-full w-full flex-col justify-center gap-4 rounded-lg p-10 shadow-2xl sm:h-auto sm:w-[70%] md:w-[50%]"
      >
        <PanelTitle level={1} id="Log in" className="mb-4">
          Log in
        </PanelTitle>
        <FormInput
          name="email"
          id="email"
          label="Insert email"
          type="email"
          placeholder="Email"
          className="p-2 pl-5"
        />

        <FormInput
          name="password"
          id="password"
          label="Insert password"
          type="password"
          placeholder="Password"
          className="p-2 pl-5"
        />
        {state?.error && (
          <p className="mt-2 text-center text-sm text-red-700">{state.error}</p>
        )}

        <div className="text-brand mx-1 flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <input type="checkbox" id="keep-logged" />
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
          aria-label="Log in"
          className="bg-brand disabled:bg-brand-light hover:bg-brand-light active:bg-brand-light mt-5 cursor-pointer rounded-3xl p-3 text-white transition-all hover:scale-[0.98] active:scale-[0.96] disabled:scale-[0.96] disabled:cursor-wait"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
