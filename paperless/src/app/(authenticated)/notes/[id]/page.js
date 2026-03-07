import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import SaveBtn from "@/app/_components/buttons/SaveNoteBtn";
import { getNoteById, getUserId } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";
import EditNoteBtn from "@/app/_components/buttons/EditNoteBtn";
import DeleteNoteBtn from "@/app/_components/buttons/DeleteNoteBtn";

export default async function Note({ params }) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  const userId = await getUserId();
  const isMine = note.user_id === userId ? true : false;

  const { title, content, created_at } = note;
  return (
    <Panel
      as="article"
      ariaLabelledBy="note-title"
      className="flex flex-col gap-10 p-6"
    >
      <header className="flex items-start justify-between">
        <div>
          <PanelTitle level={1} id="note-title">
            {title}
          </PanelTitle>
          <div className="text-brand-light mt-3 flex flex-col gap-x-2 sm:flex-row">
            <span>By: {note.profiles?.full_name}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              •
            </span>
            <time dateTime={created_at}>
              {new Date(created_at).toLocaleDateString()}
            </time>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <SaveBtn note={note} />
          {isMine && (
            <>
              <EditNoteBtn note={note} />
              <DeleteNoteBtn note={note} />
            </>
          )}
        </div>
      </header>

      <div className="prose prose-brand max-w-none leading-relaxed whitespace-pre-wrap">
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
