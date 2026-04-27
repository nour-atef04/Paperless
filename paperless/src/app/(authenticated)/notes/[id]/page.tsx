import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import SaveBtn from "@/app/_components/buttons/SaveNoteBtn";
import {
  getFoldersByUserId,
  getNoteById,
  getUserId,
} from "@/app/_lib/data-service";
import { notFound } from "next/navigation";
import EditNoteBtn from "@/app/_components/buttons/EditNoteBtn";
import DeleteNoteBtn from "@/app/_components/buttons/DeleteNoteBtn";
import Link from "next/link";
import { FolderProvider } from "@/app/_context/FolderContext";
import NoteActionBar from "@/app/_components/notes/NoteActionBar";

// No SSG since this page relies on getUserId() which checks cookies

type NoteProps = {
  params: Promise<{ id: string }>;
};

export default async function Note({ params }: NoteProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  const userId = await getUserId();
  const isMine = note.user_id === userId;

  // fetch the user's folders so we use the Move/Copy dropdown
  const folders = userId ? await getFoldersByUserId(userId) : [];

  const { title, content, created_at } = note;
  return (
    <Panel
      as="article"
      ariaLabelledBy="note-title"
      className="flex flex-col gap-10 p-6"
    >
      <header className="flex items-start justify-between">
        <div>
          <PanelTitle level={1}>{title}</PanelTitle>
          <div className="text-brand-light mt-3 flex flex-col gap-x-2 sm:flex-row">
            <span>
              By:{" "}
              <Link
                className="hover:underline"
                href={`/profile/${note.user_id}`}
              >
                {note.profiles?.full_name}
              </Link>
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              •
            </span>
            <time dateTime={created_at}>
              {new Date(created_at).toLocaleDateString()}
            </time>
          </div>
        </div>

        {/* wrap in the provider because we need the folder names */}
        <FolderProvider folders={folders}>
          <NoteActionBar
            note={note}
            showOptions={isMine}
            className="flex flex-col sm:flex-row sm:gap-2"
            optionsMenuClass="right-0 top-8"
          />
        </FolderProvider>
      </header>

      <div className="prose prose-brand prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-li:leading-snug max-w-none leading-normal">
        <ReactMarkdown
          disallowedElements={["h1"]}
          unwrapDisallowed={true}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Panel>
  );
}
