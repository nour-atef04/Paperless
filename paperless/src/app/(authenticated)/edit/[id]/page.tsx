import NoteForm from "@/app/_components/notes/NoteForm";
import { editNote } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await getNoteById(id);

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: `Edit: ${note.title}`,
    description: `Edit ${note.title} on Paperless.`,
  };
}

type EditNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    return notFound();
  }

  return <NoteForm note={note} serverAction={editNote} />;
}
