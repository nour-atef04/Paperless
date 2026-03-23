import NotesList from "@/app/_components/ui/NotesList";
import { getFolderName, getMyFolders } from "@/app/_lib/data-service";
import { Suspense } from "react";
import SortButtons from "../buttons/SortButtons";
import FolderList from "../folder/FolderList";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import SearchBarPanel from "./SearchBarPanel";

export default async function NotesTemplate({ query, page, sort, folderId }) {
  const titles = {
    dashboard: "Dashboard",
    saved: "Saved Notes",
    "my-notes": "My Notes",
  };

  const currentTitle = titles[page] || "Notes";
  const titleId = `${page}-title`;

  let folderName;
  if (folderId) {
    folderName = await getFolderName(folderId);
  }

  let folders = [];
  if (page === "my-notes") {
    folders = await getMyFolders();
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel ariaLabelledBy={titleId} className="flex flex-col gap-6 p-6">
        <header className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:gap-0 md:flex-col md:gap-5 lg:flex-row">
          <PanelTitle level={1} id={titleId}>
            {currentTitle}
          </PanelTitle>

          {/* if not "my notes" page -> put buttons next to panel title */}
          {page !== "my-notes" && <SortButtons />}
        </header>
        {/* folders section in "my notes" page */}
        {page === "my-notes" && (
          <section className="flex flex-col gap-9">
            <div className="flex items-center justify-between">
              <h2 className="text-brand text-xl font-semibold">Folders</h2>
              {/* <NewFolderBtn />  */}
            </div>
            
            <FolderList folders={folders} />
          </section>
        )}

        <section className="mt-10 flex flex-col gap-9">
          {/* notes section in "my notes" page */}
          {page === "my-notes" && (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <h2 className="text-brand text-xl font-semibold">
                {folderName ? `Notes/${folderName}` : "All Notes"}
              </h2>
              <SortButtons />
            </div>
          )}

          <Suspense
            key={`${query}-${sort}-${folderId}`}
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
            <NotesList
              query={query}
              page={page}
              sort={sort}
              folderId={folderId}
            />
          </Suspense>
        </section>
      </Panel>
    </div>
  );
}
