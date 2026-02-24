import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
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
    <Panel ariaLabelledBy="note-title" className="flex flex-col gap-10 p-6">
      <PanelTitle level={1} id="note-title">
        {title}
      </PanelTitle>
      <p>{content}</p>
    </Panel>
  );
}
