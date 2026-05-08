import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import NoteActionBar from "@/app/_components/notes/NoteActionBar";
import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import { FolderProvider } from "@/app/_context/FolderContext";
import {
  getFoldersByUserId,
  getMyFolders,
  getNoteById,
  getUserId,
} from "@/app/_lib/data-service";
import Link from "next/link";
import { notFound } from "next/navigation";
import VisibilityIcon from "@/app/_components/ui/VisibilityIcon";
import NoteSummary from "@/app/_components/notes/NoteSummary";

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

  const folders = userId ? await getMyFolders(null, "my-notes") : [];

  const { title, content, created_at, tags } = note; 

  return (
    <Panel
      as="article"
      ariaLabelledBy="note-title"
      className="flex flex-col gap-10 p-6"
    >
      <header className="flex items-start justify-between">
        <div>
          <PanelTitle level={1}>{title}</PanelTitle>
          <div className="text-brand-light mt-3 flex flex-col gap-x-2 sm:flex-row sm:items-center">
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
            <span className="hidden sm:inline" aria-hidden="true">
              •
            </span>
            <VisibilityIcon variant="note" isPublic={note.public} />
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-brand/10 text-brand rounded-md px-2.5 py-1 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <FolderProvider folders={folders}>
          <NoteActionBar
            note={note}
            showDropdown={isMine}
            showEditDelete={isMine}
            className="flex flex-col sm:flex-row sm:gap-2"
            optionsMenuClass="right-0 top-8"
          />
        </FolderProvider>
      </header>

      <NoteSummary
        noteId={note.id}
        content={note.content}
        initialSummary={note.summary}
        isOwner={isMine}
      />

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
