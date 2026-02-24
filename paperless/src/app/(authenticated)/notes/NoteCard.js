"use client";

import { toggleSaveNote } from "@/app/_lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

export default function NoteCard({ note }) {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const initiallySaved = note.user_saves?.length > 0;

  // local state for instant UI updates (optimistic ui)
  const [isSaved, setIsSaved] = useState(initiallySaved);

  const handleNavigation = (e) => {
    e.preventDefault();
    startNavigation(() => {
      // startTransition stays "true" until the next page is fully ready
      router.push(`/notes/${note.id}`);
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSaved(!isSaved);

    startSaving(async () => {
      try {
        await toggleSaveNote(note.id);
      } catch (error) {
        console.error("Failed to save note: ", error);
        // revert heart back to original if saving failed
        setIsSaved(initiallySaved);
        // TODO: SHOW A TOAST NOTIF
      }
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
        <p className="text-brand-light text-sm opacity-80">
          By: {note.profiles?.full_name}
        </p>

        <button
          aria-label="Save note"
          disabled={isSaving}
          // "z-10" so it sits ABOVE the Link's invisible overlay
          className="focus-visible:ring-brand relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm focus:outline-none focus-visible:ring-2"
          onClick={handleSave}
        >
          {!isSaved ? (
            <BsBookmark
              aria-hidden="true"
              className="text-brand-light absolute text-2xl transition-transform hover:scale-110"
            />
          ) : (
            <BsBookmarkFill
              aria-hidden="true"
              className="text-brand absolute text-2xl transition-transform hover:scale-110"
            />
          )}
        </button>
      </div>
    </article>
  );
}
