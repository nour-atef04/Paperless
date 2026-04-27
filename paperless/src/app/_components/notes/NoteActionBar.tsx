"use client";

import { useState } from "react";
import { NoteWithDetails } from "@/app/_lib/types";
import SaveNoteBtn from "../buttons/SaveNoteBtn";
import EditNoteBtn from "../buttons/EditNoteBtn";
import DeleteNoteBtn from "../buttons/DeleteNoteBtn";
import ActionsBtn from "../buttons/ActionsBtn";
import NoteOptions from "./NoteOptions";

type NoteActionBarProps = {
  note: NoteWithDetails;
  showOptions: boolean;
  isOpen?: boolean;
  setOpenOptionsId?: (id: string | null) => void;
  className?: string; // to allow different flex layouts per page
  optionsMenuClass?: string;
};

export default function NoteActionBar({
  note,
  showOptions,
  isOpen,
  setOpenOptionsId,
  className = "flex flex-wrap items-center",
  optionsMenuClass,
}: NoteActionBarProps) {
  // if setOpenOptionsId is passed, let the parent control it, o.w. (like on the single note page), manage it locally
  const [localOpenId, setLocalOpenId] = useState<string | null>(null);

  const isDropdownOpen =
    isOpen !== undefined ? isOpen : localOpenId === note.id;

  const handleSetOpen = (id: string | null) => {
    if (setOpenOptionsId) {
      setOpenOptionsId(id);
    } else {
      setLocalOpenId(id);
    }
  };

  return (
    <div className={className}>
      <SaveNoteBtn note={note} />

      {showOptions && (
        <>
          <EditNoteBtn note={note} />
          <DeleteNoteBtn note={note} />
          <div className="relative">
            <ActionsBtn
              id={note.id}
              name={note.title}
              isOpen={isDropdownOpen}
              setOpenOptionsId={handleSetOpen}
              variant="note"
            />
            <NoteOptions
              note={note}
              setOpenOptionsId={handleSetOpen}
              isOpen={isDropdownOpen}
              optionsMenuClass={optionsMenuClass}
            />
          </div>
        </>
      )}
    </div>
  );
}
