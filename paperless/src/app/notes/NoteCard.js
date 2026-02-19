import Link from "next/link";

export default function NoteCard({ note }) {
  return (
    <article className="h-80">
      <Link
        href={`/notes/${note.id}`}
        className="border-brand-light focus-visible:ring-brand flex h-full w-full cursor-pointer flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-transform hover:scale-[0.98] focus:outline-none focus-visible:ring-2 active:scale-[0.96]"
      >
        <h2 className="text-brand text-2xl">{note.title}</h2>
        <p className="text-brand-light mt-4 line-clamp-4">{note.content}</p>
      </Link>
    </article>
  );
}
