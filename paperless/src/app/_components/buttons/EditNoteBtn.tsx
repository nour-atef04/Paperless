"use client";

import { NoteWithDetails } from "@/app/_lib/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { GoPencil } from "react-icons/go";

type EditNoteBtnProps = {
  note: NoteWithDetails;
};

export default function EditNoteBtn({ note }: EditNoteBtnProps) {
  const [isNavigating, startNavigation] = useTransition();

  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startNavigation(() => {
      router.push(`/edit/${note.id}`);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isNavigating}
      aria-label={`Edit note: ${note.title}`}
      className="focus-ring-primary relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm"
    >
      {isNavigating ? (
        <FaSpinner className="text-brand animate-spin text-xl" />
      ) : (
        <GoPencil
          aria-hidden="true"
          className="text-brand absolute text-xl transition-transform hover:scale-110"
        />
      )}
    </button>
  );
}
