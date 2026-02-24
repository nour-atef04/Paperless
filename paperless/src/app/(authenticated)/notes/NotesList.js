import { getDashboardNotes, getMyNotes } from "../../_lib/data-service";
import NoteCard from "./NoteCard";

export default async function NotesList({
  query,
  page = "dashboard", // "dashboard" || "my-notes"
}) {
  const notes =
    page === "dashboard"
      ? await getDashboardNotes(query)
      : await getMyNotes(query);

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
