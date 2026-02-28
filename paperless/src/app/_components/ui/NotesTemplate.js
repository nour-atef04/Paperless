import { Suspense } from "react";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import SearchBarPanel from "./SearchBarPanel";
import NotesList from "@/app/_components/ui/NotesList";

export default async function NotesTemplate({ query, page }) {
  const titles = {
    dashboard: "Dashboard",
    saved: "Saved Notes",
    "my-notes": "My Notes",
  };

  const currentTitle = titles[page] || "Notes";
  const titleId = `${page}-title`;

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel ariaLabelledBy={titleId} className="flex flex-col gap-10 p-6">
        <PanelTitle level={1} id={titleId}>
          {currentTitle}
        </PanelTitle>
        <Suspense
          key={query}
          fallback={
            <div
              className="flex flex-col items-center py-10"
              role="status"
              aria-live="polite"
            >
              <p className="text-brand-light animate-pulse">
                Loading {currentTitle.toLowerCase()}...
              </p>
            </div>
          }
        >
          <NotesList query={query} page={page} />
        </Suspense>
      </Panel>
    </div>
  );
}
