import { getNotes } from "../_lib/data-service";
import NoteCard from "./NoteCard";

export default async function NotesList() {
  const notes = await getNotes();

  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
      {notes.map((note) => (
        <li key={note.id} className="list-none">
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}
