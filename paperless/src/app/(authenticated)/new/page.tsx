import NoteForm from "@/app/_components/notes/NoteForm";
import { postNewNote } from "@/app/_lib/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Note",
};

export default function NewNotePage() {
  return <NoteForm serverAction={postNewNote} />;
}
