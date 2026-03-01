"use client";

import { deleteNote } from "@/app/_lib/actions";
import { useTransition } from "react";
import { IoTrashOutline } from "react-icons/io5";

export default function DeleteNoteBtn({ noteId }) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    startDeleting(async () => {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error("Failed to save note: ", error);
        // TODO: SHOW A TOAST NOTIF + GREY NOTE OUT
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete Note"
      className="focus-ring-primary relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm"
    >
      <IoTrashOutline
        aria-hidden="true"
        className="text-brand absolute text-2xl transition-transform hover:scale-110"
      />
    </button>
  );

  // aria-label="Save note"
  //     disabled={isSaving}
}
