"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsNavigating(false);
  }

  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      onClick={() => setIsNavigating(true)}
      aria-disabled={isNavigating}
      aria-current={isActive ? "page" : undefined}
      href={href}
      className={`${isActive || isNavigating ? "text-brand" : "text-brand-light"} focus-ring-primary hover:text-brand flex items-center gap-2 rounded-sm transition`}
    >
      {children}
    </Link>
  );
}
