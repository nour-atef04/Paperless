"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import SaveNoteBtn from "@/app/_components/buttons/SaveNoteBtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import DeleteNoteBtn from "../buttons/DeleteNoteBtn";
import EditNoteBtn from "../buttons/EditNoteBtn";
import ActionsBtn from "../buttons/ActionsBtn";
import OptionsList from "../ui/OptionsList";

export default function NoteCard({
  note,
  userId,
  page,
  openOptionsId,
  setOpenOptionsId,
}) {
  const isMine = note.user_id === userId;
  const isOpen = openOptionsId === note.id; // for the options

  const showOptions = isMine && page === "my-notes";

  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const handleNavigation = (e) => {
    e.preventDefault();
    startNavigation(() => {
      // startTransition stays "true" until the next page is fully ready
      router.push(`/notes/${note.id}`);
    });
  };

  const noteOptions = [
    {
      label: "Move",
      onClick: () => {
        console.log("Open Move Modal!");
      },
    },
    {
      label: "Copy",
      onClick: () => {
        console.log("Open Move Modal!");
      },
    },
  ];

  return (
    <article
      className={`focus-visible:ring-brand relative flex h-80 w-full flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-all focus-visible:ring-2 focus-visible:outline-none ${
        isNavigating
          ? "scale-[0.98] cursor-wait opacity-50 grayscale"
          : "border-brand-light hover:scale-[0.98]"
      }`}
    >
      <h2 className="text-brand line-clamp-1 text-2xl">
        <Link
          onClick={handleNavigation}
          href={`/notes/${note.id}`}
          aria-disabled={isNavigating}
          // "before:inset-0" stretches the "ghost element"'s clickable area to cover the parent <article>
          className="before:absolute before:inset-0 before:z-0 focus:outline-none"
        >
          {note.title}
        </Link>
      </h2>

      <div className="text-brand-light mt-4 line-clamp-6 w-full text-sm whitespace-pre-wrap">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          disallowedElements={["h1"]}
          unwrapDisallowed={true}
        >
          {note.content}
        </ReactMarkdown>
      </div>

      <div className="border-brand-light/20 mt-auto flex w-full items-center justify-between border-t pt-3">
        <div className="text-brand-light flex flex-col text-sm opacity-80">
          <span>By: {note.profiles?.full_name}</span>
          <time dateTime={note.created_at}>
            {new Date(note.created_at).toLocaleDateString()}
          </time>
        </div>

        <div className="flex flex-wrap items-center">
          <SaveNoteBtn note={note} />
          {showOptions && (
            <>
              <EditNoteBtn note={note} />
              <DeleteNoteBtn note={note} />
            </>
          )}
          <div className="relative">
            <ActionsBtn
              id={note.id}
              name={note.title}
              isOpen={isOpen}
              setOpenOptionsId={setOpenOptionsId}
              variant="note"
            />

            {isOpen && (
              <OptionsList
                className="right-0"
                options={noteOptions}
                closeMenu={() => setOpenOptionsId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
