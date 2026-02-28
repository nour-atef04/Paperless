"use client"

import { toggleSaveNote } from "@/app/_lib/actions";
import { useState, useTransition } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

export default function SaveBtn({note}) {
  const [isSaving, startSaving] = useTransition();

  const initiallySaved = note.user_saves?.length > 0;

  // local state for instant UI updates (optimistic ui)
  const [isSaved, setIsSaved] = useState(initiallySaved);

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
  );
}
