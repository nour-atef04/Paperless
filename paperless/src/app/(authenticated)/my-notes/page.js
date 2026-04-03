import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";

export default async function MyNotesPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const sort = params?.sort || "most-relevant";
  const folderId = params?.folder || null;

  return (
    <NotesPageTemplate
      query={query}
      page="my-notes"
      sort={sort}
      folderId={folderId}
    />
  );
}
