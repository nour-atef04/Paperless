import { FolderProvider } from "@/app/_context/FolderContext";
import {
  getDashboardNotes,
  getMyFolders,
  getMyNotes,
  getSavedNotes,
  getUserId,
} from "../../_lib/data-service";
import NotesGrid from "./NotesGrid";
import { NoteWithDetails, PageRoute, SortOption } from "@/app/_lib/types";

type NotesListProps = {
  query?: string;
  page?: PageRoute;
  sort?: SortOption;
  folderId?: string;
};

export default async function NotesList({
  query,
  page = "dashboard",
  sort = "most-relevant",
  folderId,
}: NotesListProps) {
  const userId = await getUserId();

  if (!userId) return null;

  let notes: NoteWithDetails[] | null = null;

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

  const folders = await getMyFolders();

  return (
    <FolderProvider folders={folders || []}>
      <NotesGrid notes={notes} userId={userId} page={page} />
    </FolderProvider>
  );
}
