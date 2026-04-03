import {
  getDashboardNotes,
  getMyNotes,
  getSavedNotes,
  getUserId,
} from "../../_lib/data-service";
import NotesGrid from "./NotesGrid";

export default async function NotesList({
  query,
  page = "dashboard", // "dashboard" || "my-notes" || "saved"
  sort = "most-relevant", // "most-relevant || "latest" || "oldest"
  folderId
}) {
  const userId = await getUserId();

  let notes;
  if (page === "dashboard") {
    notes = await getDashboardNotes(query, sort);
  } else if (page === "my-notes") {
    notes = await getMyNotes(query, sort, folderId);
  } else if (page === "saved") {
    notes = await getSavedNotes(query, sort);
  }

  if (!notes || notes.length === 0) {
    return <p className="text-brand py-9 text-center">No notes found.</p>;
  }

  return (
    <NotesGrid notes={notes} userId={userId} page={page}/>
  );
}
