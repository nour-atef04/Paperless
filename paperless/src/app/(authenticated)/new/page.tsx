import NoteForm from "@/app/_components/notes/NoteForm";
import { postNewNote } from "@/app/_lib/actions";

export default function NewNotePage() {
  return <NoteForm serverAction={postNewNote} />;
}
