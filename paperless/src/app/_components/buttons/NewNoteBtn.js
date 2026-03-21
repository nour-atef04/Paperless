"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function NewNoteBtn() {
  // const pathname = usePathname();
  // const [prevPathname, setPrevPathname] = useState(pathname);
  // const [isNavigating, setIsNavigating] = useState(false);

  // // used this so i can keep using <Link> component for main navigation
  // if (pathname !== prevPathname) {
  //   setPrevPathname(pathname);
  //   setIsNavigating(false);
  // }

  return (
    <Link
      href="/new"
      // onClick={() => setIsNavigating(true)}
      // aria-disabled={isNavigating}
      aria-label="Create new note"
      // className={` ${isNavigating ? "btn-disabled" : "btn-primary"} ml-auto flex shrink-0 items-center gap-2 rounded-full p-2 transition-all sm:rounded-md md:ml-0 md:w-full md:rounded-md md:px-4 md:py-2`}
      className={"btn-primary ml-auto flex shrink-0 items-center gap-2 rounded-full p-2 transition-all sm:rounded-md md:ml-0 md:w-full md:rounded-md md:px-4 md:py-2"}

    >
      <FaPlus aria-hidden="true" />
      <span className="hidden sm:inline">New Note</span>
    </Link>
  );
}
