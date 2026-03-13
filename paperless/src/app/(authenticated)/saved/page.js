import NotesTemplate from "@/app/_components/ui/NotesTemplate";

export default async function SavedNotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "most-relevant";

  return <NotesTemplate query={query} page="saved" sort={sort} />;
}
