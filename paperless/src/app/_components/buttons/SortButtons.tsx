"use client";

import { SortOption } from "@/app/_lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSortAlphaDown } from "react-icons/fa";
import OptionsList from "../ui/OptionsList";

export default function SortButtons() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [openOptionsList, setOpenOptionsList] = useState(false);

  const currentSort = searchParams.get("sort") || "most-relevant";

  const handleSort = (sortValue: SortOption) => {
    const sortOptionName = sortValue.split(" ").join("-").toLowerCase();

    const params = new URLSearchParams(searchParams);
    params.set("sort", sortOptionName);
    router.push(`${pathname}?${params.toString()}`);
  };

  const options = [
    {
      label: "Most relevant",
      onClick: () => handleSort("Most relevant"),
    },
    {
      label: "Latest",
      onClick: () => handleSort("Latest"),
    },
    {
      label: "Oldest",
      onClick: () => handleSort("Oldest"),
    },
  ];

  return (
    <div className="relative">
      <button
        className="inline sm:hidden"
        onClick={() => setOpenOptionsList((prev) => !prev)}
        aria-label="Sort options"
        aria-haspopup="true"
        aria-expanded={openOptionsList}
      >
        <FaSortAlphaDown
          aria-disabled="true"
          className="text-brand-light hover:text-brand hover:cursor-pointer"
          size={20}
        />
      </button>

      <ul className="hidden sm:flex sm:flex-wrap sm:gap-2">
        {options.map((option) => {
          const formattedLabel = option.label
            .split(" ")
            .join("-")
            .toLowerCase();
          const isSelected = currentSort === formattedLabel;

          return (
            <li key={option.label}>
              <button
                className={`${isSelected ? "btn-secondary" : "btn-outline"} rounded-sm px-2`}
                onClick={option.onClick}
                aria-current={isSelected ? "true" : undefined}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>

      {openOptionsList && (
        <OptionsList
          className="top-8 right-1"
          options={options}
          closeMenu={() => setOpenOptionsList(false)}
        />
      )}
    </div>
  );
}
