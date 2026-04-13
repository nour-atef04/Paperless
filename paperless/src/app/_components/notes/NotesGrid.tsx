"use client";

import { useState } from "react";
import NoteCard from "./NoteCard";
import { NoteWithDetails, PageRoute } from "@/app/_lib/types";

type NotesGridProps = {
  notes: NoteWithDetails[];
  userId: string;
  page: PageRoute;
};

export default function NotesGrid({ notes, userId, page }: NotesGridProps) {
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);

  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
      {notes.map((note) => (
        <li key={note.id} className="list-none">
          <NoteCard
            note={note}
            userId={userId}
            page={page}
            openOptionsId={openOptionsId}
            setOpenOptionsId={setOpenOptionsId}
          />
        </li>
      ))}
    </ul>
  );
}
