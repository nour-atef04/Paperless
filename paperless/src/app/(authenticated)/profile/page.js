"use client";
import { useActionState } from "react";
import { logoutAction } from "../../_lib/actions";

export default function ProfilePage() {
  const [state, formAction, isPending] = useActionState(logoutAction, null);

  return (
    <form action={formAction} className="flex flex-col items-start gap-4">
      <button
        disabled={isPending}
        type="submit"
        className="bg-brand cursor-pointer rounded-sm px-6 py-3 font-medium text-white transition-all hover:opacity-90 active:scale-95"
      >
        {isPending ? "Logging out..." : "Log out"}
      </button>

      {state?.error && (
        <p className="text-sm font-medium text-red-500" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
