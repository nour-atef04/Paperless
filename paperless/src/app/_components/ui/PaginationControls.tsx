"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-4 text-sm">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="text-brand hover:bg-brand/10 border-brand/20 rounded-md border px-4 py-2 transition-colors"
        >
          &larr; Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-gray-200 px-4 py-2 text-gray-400">
          &larr; Previous
        </span>
      )}

      <span className="text-brand-dark font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="text-brand hover:bg-brand/10 border-brand/20 rounded-md border px-4 py-2 transition-colors"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-gray-200 px-4 py-2 text-gray-400">
          Next &rarr;
        </span>
      )}
    </div>
  );
}
