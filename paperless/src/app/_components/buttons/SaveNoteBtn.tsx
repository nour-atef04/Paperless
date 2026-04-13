"use client";

import { toggleSaveNote } from "@/app/_lib/actions";
import { NoteWithDetails } from "@/app/_lib/types";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa6";

type SaveNoteBtnProps = {
  note: NoteWithDetails;
};

export default function SaveBtn({ note }: SaveNoteBtnProps) {
  const [isSaving, startSaving] = useTransition();

  const initiallySaved = note.user_saves?.length > 0;

  // local state for instant UI updates (optimistic ui)
  const [isSaved, setIsSaved] = useState(initiallySaved);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSaved(!isSaved);

    startSaving(async () => {
      try {
        const result = await toggleSaveNote(note.id);

        if (
          typeof result === "object" &&
          result !== null &&
          "error" in result
        ) {
          throw new Error(result.error);
        }

        if (result === true) {
          toast.success("Note removed from saved!");
        } else toast.success("Note added to saved!");
      } catch (error: any) {
        console.error("Failed to save note: ", error);
        // revert heart back to original if saving failed
        setIsSaved(initiallySaved);
        toast.error(error.message || "Failed to save note.");
      }
    });
  };

  return (
    <button
      aria-label={`Save note: ${note.title}`}
      disabled={isSaving}
      // "z-10" so it sits ABOVE the Link's invisible overlay
      className="focus-ring-primary relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm"
      onClick={handleSave}
    >
      {isSaving ? (
        <FaSpinner className="text-brand animate-spin text-xl" />
      ) : !isSaved ? (
        <BsBookmark
          aria-hidden="true"
          className="text-brand absolute text-xl transition-transform hover:scale-110"
        />
      ) : (
        <BsBookmarkFill
          aria-hidden="true"
          className="text-brand absolute text-xl transition-transform hover:scale-110"
        />
      )}
    </button>
  );
}
