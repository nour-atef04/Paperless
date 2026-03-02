"use client";

import { FaSpinner } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
export default function EditNoteBtn({note}) {
  return (
    <button
    //   onClick={openModal}
    //   disabled={isDeleting}
      aria-label={`Delete note: ${note.title}`}
      className="focus-ring-primary relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm"
    >
      {/* {isDeleting ? (
        <FaSpinner className="text-brand animate-spin text-xl" />
      ) : ( */}
        <GoPencil
          aria-hidden="true"
          className="text-brand absolute text-xl transition-transform hover:scale-110"
        />
      {/* )} */}
    </button>
  );
}
