"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={href}
      className={`${isActive ? "text-brand" : "text-brand-light"} focus-ring-primary hover:text-brand flex items-center gap-2 rounded-sm transition`}
    >
      {children}
    </Link>
  );
}
