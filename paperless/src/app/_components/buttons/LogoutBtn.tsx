"use client";

import { logoutAction } from "@/app/_lib/actions";
import { useTransition } from "react";

export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      type="button" 
      onClick={handleLogout}
      disabled={isPending}
      className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors disabled:cursor-wait disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Log Out"}
    </button>
  );
}