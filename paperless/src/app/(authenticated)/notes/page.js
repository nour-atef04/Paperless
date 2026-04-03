import NotesPageTemplate from "@/app/_components/notes/NotesPageTemplate";

export default async function NotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "most-relevant";
  return <NotesPageTemplate query={query} page="dashboard" sort={sort} />;
}
