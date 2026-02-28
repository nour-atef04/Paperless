import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import SaveBtn from "@/app/_components/ui/SaveBtn";
import { getNoteById } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export default async function Note({ params }) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  const { title, content } = note;
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
          <div className="text-brand-light mt-3 flex flex-wrap gap-x-2">
            <span>By: {note.profiles?.full_name}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={note.created_at}>
              {new Date(note.created_at).toLocaleDateString()}
            </time>
          </div>
        </div>
        <SaveBtn note={note} />
      </header>

      <div className="prose prose-brand max-w-none leading-relaxed">
        <p>{content}</p>
      </div>
    </Panel>
  );
}
