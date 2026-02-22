"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FormInput from "./FormInput";
import Panel from "./Panel";
import { IoMdSearch } from "react-icons/io";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBarPanel({ className }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <search className={className}>
      <div className="flex items-center gap-3">
        <IoMdSearch aria-hidden="true" className="text-brand-light text-2xl" />
        <FormInput
          aria-label="Search notes"
          className="w-full rounded-4xl p-3"
          placeholder="Search notes..."
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </search>
  );
}
