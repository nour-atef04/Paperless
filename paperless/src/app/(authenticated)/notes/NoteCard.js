"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function NoteCard({ note }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (e) => {
    e.preventDefault();
    startTransition(() => {
      // startTransition stays "true" until the next page is fully ready
      router.push(`/notes/${note.id}`);
    });
  };

  return (
    <article className="h-80">
      <Link
        onClick={handleNavigation}
        href={`/notes/${note.id}`}
        className={`flex h-full w-full flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-all ${
          isPending
            ? "scale-[0.98] cursor-wait opacity-50 grayscale"
            : "border-brand-light cursor-pointer hover:scale-[0.98] active:scale-[0.96]"
        } focus-visible:ring-brand focus:outline-none focus-visible:ring-2`}
      >
        <h2 className="text-brand text-2xl">{note.title}</h2>
        <p className="text-brand-light mt-4 line-clamp-4">{note.content}</p>
      </Link>
    </article>
  );
}
