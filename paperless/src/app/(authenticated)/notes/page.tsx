import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";
import { PageSearchParams } from "@/app/_lib/types";

type NotesPageProps = {
  searchParams: PageSearchParams;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const currentPage = Number((await searchParams)?.page) || 1;
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "most-relevant";
  return (
    <NotesPageTemplate
      currentPage={currentPage}
      query={query}
      page="dashboard"
      sort={sort}
    />
  );
}
