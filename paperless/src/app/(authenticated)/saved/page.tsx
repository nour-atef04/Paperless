import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";
import { PageSearchParams } from "@/app/_lib/types";

type SavedNotesPageProps = {
  searchParams: PageSearchParams;
};

export default async function SavedNotesPage({
  searchParams,
}: SavedNotesPageProps) {
  
  const params = await searchParams;

  const query = params.query || "";
  const sort = params.sort || "most-relevant";

  return <NotesPageTemplate query={query} page="saved" sort={sort} />;
}
