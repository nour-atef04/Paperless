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
import { ITEMS_PER_PAGE } from "@/app/_lib/constants";
import PaginationControls from "../ui/PaginationControls";

type NotesListProps = {
  query?: string;
  page?: PageRoute;
  sort?: SortOption;
  folderId?: string;
  currentPage?: number;
};

export default async function NotesList({
  query,
  page = "dashboard",
  sort = "most-relevant",
  folderId,
  currentPage = 1,
}: NotesListProps) {
  const userId = await getUserId();

  if (!userId) return null;

  let result: { notes: NoteWithDetails[]; count: number } | null = null;

  if (page === "dashboard") {
    result = await getDashboardNotes(query, sort, currentPage);
  } else if (page === "my-notes") {
    result = await getMyNotes(query, sort, folderId, currentPage);
  } else if (page === "saved") {
    result = await getSavedNotes(query, sort, folderId, currentPage);
  }

  if (!result || !result.notes || result.notes.length === 0) {
    return <p className="text-brand py-9 text-center">No notes found.</p>;
  }

  const totalPages = Math.ceil(result.count / ITEMS_PER_PAGE);
  const folders = await getMyFolders();

  return (
    <FolderProvider folders={folders || []}>
      <div className="flex flex-col gap-8">
        <NotesGrid notes={result.notes} userId={userId} page={page} />

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </FolderProvider>
  );
}
