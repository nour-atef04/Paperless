import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";
import { PageSearchParams } from "@/app/_lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Notes",
};


type SavedNotesPageProps = {
  searchParams: PageSearchParams;
};

export default async function SavedNotesPage({
  searchParams,
}: SavedNotesPageProps) {
  const params = await searchParams;

  const currentPage = Number((await searchParams)?.page) || 1;
  const query = params.query || "";
  const sort = params.sort || "most-relevant";
  const folderId = params?.folder || undefined;

  return (
    <NotesPageTemplate
      currentPage={currentPage}
      query={query}
      page="saved"
      sort={sort}
      folderId={folderId}
    />
  );
}
