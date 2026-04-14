import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";
import { PageSearchParams, SortOption } from "@/app/_lib/types";

type NotesPageProps = {
  searchParams: PageSearchParams;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "most-relevant";
  return <NotesPageTemplate query={query} page="dashboard" sort={sort} />;
}
