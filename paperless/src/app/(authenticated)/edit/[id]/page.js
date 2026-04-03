import NoteForm from "@/app/_components/notes/NoteForm";
import { editNote } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export default async function EditNotePage({ params }) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    return notFound();
  }

  const { title, content } = note;

  return <NoteForm note={note} serverAction={editNote} />;
}
