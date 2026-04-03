import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";

export default async function SavedNotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "most-relevant";

  return <NotesPageTemplate query={query} page="saved" sort={sort} />;
}
