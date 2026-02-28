import NotesTemplate from "@/app/_components/ui/NotesTemplate";

export default async function myNotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";

  return <NotesTemplate query={query} page="my-notes" />;
}
