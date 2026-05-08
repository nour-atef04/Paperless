import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";
import { PageSearchParams } from "@/app/_lib/types";

type MyNotesPageProps = {
  searchParams: PageSearchParams;
};

export default async function MyNotesPage({ searchParams }: MyNotesPageProps) {
  const params = await searchParams;

  const currentPage = Number((await searchParams)?.page) || 1;
  const query = params?.query || "";
  const sort = params?.sort || "most-relevant";
  const folderId = params?.folder || undefined;

  return (
    <NotesPageTemplate
      currentPage={currentPage}
      query={query}
      page="my-notes"
      sort={sort}
      folderId={folderId}
    />
  );
}
