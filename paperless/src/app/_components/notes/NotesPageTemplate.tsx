import NotesList from "@/app/_components/notes/NotesList";
import { getFolderName, getMyFolders } from "@/app/_lib/data-service";
import { Suspense } from "react";
import SortButtons from "../buttons/SortButtons";
import FolderList from "../folder/FolderList";
import Panel from "../ui/Panel";
import PanelTitle from "../ui/PanelTitle";
import SearchBarPanel from "../ui/SearchBarPanel";
import { Folder, PageRoute, SortOption } from "@/app/_lib/types";
import Link from "next/link";
import LoadingSkeleton from "../ui/LoadingSkeleton";

type NotesPageTemplateProps = {
  query?: string;
  page: PageRoute;
  sort?: SortOption;
  folderId?: string;
  currentPage?: number;
};

export default async function NotesPageTemplate({
  query,
  page,
  sort,
  folderId,
  currentPage = 1,
}: NotesPageTemplateProps) {
  // record to that TS forces to define every page route
  const titles: Record<PageRoute, string> = {
    dashboard: "Dashboard",
    saved: "Saved Notes",
    "my-notes": "My Notes",
    profile: "Profile",
  };

  const currentTitle = titles[page];
  const titleId = `${page}-title`;

  let folderName: string | null = null;
  if (folderId) {
    folderName = await getFolderName(folderId);
  }

  let folders: Folder[] = [];
  if (page === "my-notes" || page === "saved") {
    const fetchedFolders = await getMyFolders(query, page);
    folders = fetchedFolders || [];
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl px-8 sm:px-0" />
      <Panel ariaLabelledBy={titleId} className="flex flex-col gap-6 p-6">
        {/* --- PAGE TITLE --- */}
        {/* <header className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:gap-0 md:flex-col md:gap-5 lg:flex-row"> */}
        <header className="flex items-center justify-between gap-5">
          <PanelTitle level={1}>{currentTitle}</PanelTitle>

          {/* if not "my notes" page -> put buttons next to panel title */}
          {page !== "my-notes" && page !== "saved" && <SortButtons />}
        </header>

        {/* --- FOLDER SECTION (IN MY NOTES + SAVED) --- */}
        {(page === "my-notes" || page === "saved") && (
          <section className="flex flex-col gap-9">
            <div className="flex items-center justify-between">
              <h2 className="text-brand-dark text-xl font-semibold">Folders</h2>
              {/* <NewFolderBtn />  */}
            </div>

            <Suspense
              key={`${query}-${sort}-${folderId}-${currentPage}`}
              fallback={<LoadingSkeleton text={currentTitle} />}
            >
              <FolderList query={query} page={page} folders={folders} />
            </Suspense>
          </section>
        )}

        {/* --- NOTES SECTION (IN MY NOTES + SAVED) --- */}
        <section className="mt-10 flex flex-col gap-9">
          {(page === "my-notes" || page === "saved") && (
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-brand-dark text-xl font-semibold">
                {folderId ? (
                  <>
                    <Link className="hover:underline" href={`/${page}`}>
                      {page === "saved" ? "All Saved Notes" : "All Notes"}
                    </Link>{" "}
                    <span className="text-brand">/ {folderName}</span>
                  </>
                ) : page === "saved" ? (
                  "All Saved Notes"
                ) : (
                  "All Notes"
                )}
              </h2>
              <SortButtons />
            </div>
          )}

          <Suspense
            key={`${query}-${sort}-${folderId}-${currentPage}`}
            fallback={<LoadingSkeleton text={`Loading ${currentTitle}...`} />}
          >
            <NotesList
              query={query}
              page={page}
              sort={sort}
              folderId={folderId}
              currentPage={currentPage}
            />
          </Suspense>
        </section>
      </Panel>
    </div>
  );
}
