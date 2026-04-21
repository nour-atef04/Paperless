import NotesList from "@/app/_components/notes/NotesList";
import { getFolderName, getMyFolders } from "@/app/_lib/data-service";
import { Suspense } from "react";
import SortButtons from "../buttons/SortButtons";
import FolderList from "../folder/FolderList";
import Panel from "../ui/Panel";
import PanelTitle from "../ui/PanelTitle";
import SearchBarPanel from "../ui/SearchBarPanel";
import { Folder, PageRoute, SortOption } from "@/app/_lib/types";

type NotesPageTemplateProps = {
  query?: string;
  page: PageRoute;
  sort?: SortOption;
  folderId?: string;
};

export default async function NotesPageTemplate({
  query,
  page,
  sort,
  folderId,
}: NotesPageTemplateProps) {
  // record to that TS forces to define every page route
  const titles: Record<PageRoute, string> = {
    dashboard: "Dashboard",
    saved: "Saved Notes",
    "my-notes": "My Notes",
  };

  const currentTitle = titles[page];
  const titleId = `${page}-title`;

  let folderName: string | null = null;
  if (folderId) {
    folderName = await getFolderName(folderId);
  }

  let folders: Folder[] = [];
  if (page === "my-notes") {
    const fetchedFolders = await getMyFolders();
    folders = fetchedFolders || [];
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel ariaLabelledBy={titleId} className="flex flex-col gap-6 p-6">
        <header className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:gap-0 md:flex-col md:gap-5 lg:flex-row">
          <PanelTitle level={1}>{currentTitle}</PanelTitle>

          {/* if not "my notes" page -> put buttons next to panel title */}
          {page !== "my-notes" && <SortButtons />}
        </header>
        {/* folders section in "my notes" page */}
        {page === "my-notes" && (
          <section className="flex flex-col gap-9">
            <div className="flex items-center justify-between">
              <h2 className="text-brand-dark text-xl font-semibold">Folders</h2>
              {/* <NewFolderBtn />  */}
            </div>

            <FolderList folders={folders} />
          </section>
        )}

        <section className="mt-10 flex flex-col gap-9">
          {/* notes section in "my notes" page */}
          {page === "my-notes" && (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <h2 className="text-brand-dark text-xl font-semibold">
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
