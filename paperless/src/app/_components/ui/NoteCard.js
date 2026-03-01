"use client";

import SaveNoteBtn from "@/app/_components/ui/SaveNoteBtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import DeleteNoteBtn from "./DeleteNoteBtn";

export default function NoteCard({ note, userId }) {
  const isMine = note.user_id === userId;

  console.log(note.user_id);

  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const handleNavigation = (e) => {
    e.preventDefault();
    startNavigation(() => {
      // startTransition stays "true" until the next page is fully ready
      router.push(`/notes/${note.id}`);
    });
  };

  return (
    <article
      className={`focus-visible:ring-brand relative flex h-80 w-full flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-all focus-visible:ring-2 focus-visible:outline-none ${
        isNavigating
          ? "scale-[0.98] cursor-wait opacity-50 grayscale"
          : "border-brand-light hover:scale-[0.98]"
      }`}
    >
      <h2 className="text-brand text-2xl">
        <Link
          onClick={handleNavigation}
          href={`/notes/${note.id}`}
          aria-disabled={isNavigating}
          // "before:inset-0" stretches the "ghost element"'s clickable area to cover the parent <article>
          className="before:absolute before:inset-0 before:z-0 focus:outline-none"
        >
          {note.title}
        </Link>
      </h2>

      <p className="text-brand-light mt-4 line-clamp-4">{note.content}</p>

      <div className="mt-auto flex w-full items-center justify-between">
        <div className="text-brand-light flex flex-col text-sm opacity-80">
          <span>By: {note.profiles?.full_name}</span>
          <time dateTime={note.created_at}>
            {new Date(note.created_at).toLocaleDateString()}
          </time>
        </div>

        <div className="flex flex-wrap items-center">
          <SaveNoteBtn note={note} />
          {isMine && (
            <DeleteNoteBtn noteId={note.id} />
          )}
        </div>
      </div>
    </article>
  );
}
