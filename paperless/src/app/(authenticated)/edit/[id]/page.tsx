import NoteForm from "@/app/_components/notes/NoteForm";
import { editNote } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

type EditNotePageProps = {
  params: Promise<{id: string}>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    return notFound();
  }

  return <NoteForm note={note} serverAction={editNote} />;
}
