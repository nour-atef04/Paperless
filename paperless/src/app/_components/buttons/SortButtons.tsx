"use client"

import { SortOption } from "@/app/_lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortButtons() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSort = searchParams.get("sort") || "most-relevant";

  const handleSort = (sortValue: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSort("most-relevant")}
        className={`${currentSort === "most-relevant" ? "btn-secondary" : "btn-outline"} rounded-sm px-2`}
      >
        Most relevant
      </button>
      <button
        onClick={() => handleSort("latest")}
        className={`${currentSort === "latest" ? "btn-secondary" : "btn-outline"} rounded-sm px-2`}
      >
        Latest
      </button>
      <button
        onClick={() => handleSort("oldest")}
        className={`${currentSort === "oldest" ? "btn-secondary" : "btn-outline"} rounded-sm px-2`}
      >
        Oldest
      </button>
    </div>
  );
}
