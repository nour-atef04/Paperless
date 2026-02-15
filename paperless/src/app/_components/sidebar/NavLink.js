"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${pathname === href ? "text-brand" : "text-brand-light"} hover:text-brand flex items-center gap-2 transition`}
    >
      {children}
    </Link>
  );
}
