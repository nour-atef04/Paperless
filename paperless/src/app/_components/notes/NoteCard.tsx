"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import SaveNoteBtn from "@/app/_components/buttons/SaveNoteBtn";
import { NoteWithDetails, PageRoute } from "@/app/_lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ActionsBtn from "../buttons/ActionsBtn";
import DeleteNoteBtn from "../buttons/DeleteNoteBtn";
import EditNoteBtn from "../buttons/EditNoteBtn";
import NoteOptions from "./NoteOptions";

type NoteCardProps = {
  note: NoteWithDetails;
  userId: string;
  page: PageRoute | string;
  openOptionsId: string | null;
  setOpenOptionsId: (id: string | null) => void;
};

export default function NoteCard({
  note,
  userId,
  page,
  openOptionsId,
  setOpenOptionsId,
}: NoteCardProps) {
  const isMine = note.user_id === userId;
  const isOpen = openOptionsId === note.id; // for the options

  const showOptions = isMine && page === "my-notes";

  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startNavigation(() => {
      // startTransition stays "true" until the next page is fully ready
      router.push(`/notes/${note.id}`);
    });
  };

  return (
    <article
      className={`focus-visible:ring-brand relative flex h-80 w-full flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-all focus-visible:ring-2 focus-visible:outline-none ${
        isNavigating
          ? "scale-[0.98] cursor-wait opacity-50 grayscale"
          : "border-brand-light hover:scale-[0.98]"
      }`}
    >
      <h2 className="text-brand-darkest line-clamp-1 text-2xl">
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
          <Link className="hover:underline" href={`/profile/${note.user_id}`}>By: {note.profiles?.full_name}</Link>
          <time dateTime={note.created_at || ""}>
            {note.created_at
              ? new Date(note.created_at).toLocaleDateString()
              : "Unknown Date"}
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
            {showOptions && (
              <ActionsBtn
                id={note.id}
                name={note.title}
                isOpen={isOpen}
                setOpenOptionsId={setOpenOptionsId}
                variant="note"
              />
            )}

            <NoteOptions
              note={note}
              setOpenOptionsId={setOpenOptionsId}
              isOpen={isOpen}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
