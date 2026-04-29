"use client";

import { useState } from "react";
import { NoteWithDetails, PageRoute } from "@/app/_lib/types";
import SaveNoteBtn from "../buttons/SaveNoteBtn";
import EditNoteBtn from "../buttons/EditNoteBtn";
import DeleteNoteBtn from "../buttons/DeleteNoteBtn";
import ActionsBtn from "../buttons/ActionsBtn";
import NoteOptions from "./NoteOptions";

type NoteActionBarProps = {
  note: NoteWithDetails;
  showEditDelete: boolean;
  showDropdown: boolean;
  page?: PageRoute | string;
  isOpen?: boolean;
  setOpenOptionsId?: (id: string | null) => void;
  className?: string; // to allow different flex layouts per page
  optionsMenuClass?: string;
};

export default function NoteActionBar({
  note,
  showEditDelete,
  showDropdown,
  isOpen,
  page,
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

      {showEditDelete && (
        <>
          <EditNoteBtn note={note} />
          <DeleteNoteBtn note={note} />
        </>
      )}
      {showDropdown && (
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
            page={page} 
          />
        </div>
      )}
    </div>
  );
}
