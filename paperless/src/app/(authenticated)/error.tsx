"use client";

import { useEffect } from "react";
import Panel from "@/app/_components/ui/Panel";
import { FaExclamationTriangle } from "react-icons/fa";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Panel className="flex max-w-md flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FaExclamationTriangle className="h-8 w-8" />
        </div>

        <h2 className="text-brand-dark mb-2 text-xl font-bold">
          Something went wrong!
        </h2>

        <p className="text-brand-light mb-8 text-sm">
          We encountered an unexpected error while trying to load this page.
          Don&apos;t worry, your data is safe.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-brand hover:bg-brand/5 border-brand-light/20 rounded-full border px-6 py-2 text-sm font-medium transition-colors hover:cursor-pointer"
          >
            Go Home
          </button>

          <button
            onClick={() => reset()}
            className="bg-brand hover:bg-brand-light rounded-full px-6 py-2 text-sm font-medium text-white transition-all hover:scale-[0.98] hover:cursor-pointer active:scale-[0.96]"
          >
            Try Again
          </button>
        </div>
      </Panel>
    </div>
  );
}
