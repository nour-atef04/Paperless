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
    <Panel className="p-6 flex flex-col gap-10">
      <PanelTitle>{title}</PanelTitle>
      <p>{content}</p>
    </Panel>
  );
}
