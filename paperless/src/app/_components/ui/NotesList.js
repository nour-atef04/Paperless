import {
  getDashboardNotes,
  getMyNotes,
  getSavedNotes,
} from "../../_lib/data-service";
import NoteCard from "./NoteCard";

export default async function NotesList({
  query,
  page = "dashboard", // "dashboard" || "my-notes" || "saved"
}) {
  let notes;
  if (page === "dashboard") {
    notes = await getDashboardNotes(query);
  } else if (page === "my-notes") {
    notes = await getMyNotes(query);
  } else if (page === "saved") {
    notes = await getSavedNotes(query);
  }

  if (!notes || notes.length === 0) {
    return <p className="text-brand pb-9 text-center">No notes found.</p>;
  }

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
