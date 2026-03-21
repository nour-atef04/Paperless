import NotesTemplate from "@/app/_components/ui/NotesTemplate";

export default async function myNotesPage({ searchParams }) {

  const params = await searchParams;

  const query = params?.query || "";
  const sort = params?.sort || "most-relevant";
  const folderId = params?.folder || null;

  return <NotesTemplate query={query} page="my-notes" sort={sort} folderId={folderId} />;
}
