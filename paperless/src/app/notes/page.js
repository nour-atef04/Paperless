import { Suspense } from "react";
import Panel from "../_components/ui/Panel";
import PanelTitle from "../_components/ui/PanelTitle";
import SearchBarPanel from "../_components/ui/SearchBarPanel";
import NotesList from "./NotesList";

export default async function NotesPage({ searchParams }) {
  const query = (await searchParams)?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel
        ariaLabelledBy="dashboard-title"
        className="flex flex-col gap-10 p-6"
      >
        <PanelTitle level={1} id="dashboard-title">
          Dashboard
        </PanelTitle>
        <Suspense
          key={query}
          fallback={
            <p
              className="text-brand-light mb-8 text-center"
              role="status"
              aria-live="polite"
            >
              Loading notes...
            </p>
          }
        >
          <NotesList query={query} />
        </Suspense>
      </Panel>
    </div>
  );
}
