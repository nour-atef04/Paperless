import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import SearchBarPanel from "@/app/_components/ui/SearchBarPanel";
import { Suspense } from "react";
import NotesList from "../notes/NotesList";

export default async function myNotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel
        ariaLabelledBy="my-notes-title"
        className="flex flex-col gap-10 p-6"
      >
        <PanelTitle level={1} id="my-notes-title">
          My Notes
        </PanelTitle>
        <Suspense
          key={query}
          fallback={
            <p
              className="text-brand-light mb-8 text-center"
              role="status"
              aria-live="polite"
            >
              Loading my notes...
            </p>
          }
        >
          <NotesList query={query} page="my-notes" />
        </Suspense>
      </Panel>
    </div>
  );
}
