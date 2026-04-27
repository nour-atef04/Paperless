import FolderList from "@/app/_components/folder/FolderList";
import NotesGrid from "@/app/_components/notes/NotesGrid";
import Panel from "@/app/_components/ui/Panel";
import SearchBarPanel from "@/app/_components/ui/SearchBarPanel";
import { FolderProvider } from "@/app/_context/FolderContext";
import {
  getFoldersByUserId,
  getNotesByUserId,
  getUserId,
  getUserProfileById,
  getFolderName,
} from "@/app/_lib/data-service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    folderId?: string;
    query?: string;
    sort?: string;
  }>;
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = await params;
  const { folderId, query, sort } = await searchParams;

  // only fetch what's needed initially
  const [user, viewerId, folderName] = await Promise.all([
    getUserProfileById(id),
    getUserId(),
    folderId ? getFolderName(folderId) : null,
  ]);

  if (!user) notFound();

  const viewerFolders = viewerId ? await getFoldersByUserId(viewerId) : [];
  const folderNameTitle = folderName ? ` / ${folderName}` : "";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="bg-surface border-brand-light/20 overflow-hidden rounded-2xl border shadow-sm">
        <div className="from-brand to-brand-light h-32 w-full bg-linear-to-r object-cover opacity-80"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-10 flex items-end justify-between">
            <div className="flex items-end gap-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="bg-surface border-surface h-32 w-32 rounded-full border-4 object-cover shadow-md"
                />
              ) : (
                <div className="bg-brand border-surface flex h-32 w-32 items-center justify-center rounded-full border-4 text-5xl font-bold text-white shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="mb-2">
                <h1 className="text-brand-dark text-3xl font-bold">
                  {user.name}
                </h1>
                <p className="text-brand-light mt-1 text-sm">
                  Paperless Scholar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchBarPanel className="mx-auto w-full max-w-xl" />

      {/* --- PUBLIC FOLDERS SECTION --- */}
      <div className="space-y-4">
        <h2
          id="folders-heading"
          className="text-brand-dark border-brand-light/20 border-b pb-2 text-xl font-semibold"
        >
          Public Folders
        </h2>

        <Panel ariaLabelledBy="folders-heading" className="p-6">
          <Suspense
            key={query}
            fallback={<LoadingSkeleton text="Loading folders..." />}
          >
            <ProfileFoldersFetcher profileId={id} query={query} />
          </Suspense>
        </Panel>
      </div>

      {/* --- PUBLIC NOTES SECTION --- */}
      <div className="space-y-4">
        <div className="border-brand-light/20 flex items-center justify-between border-b pb-2">
          <h2
            id="notes-heading"
            className="text-brand-dark text-xl font-semibold"
          >
            Public Notes <span className="text-brand">{folderNameTitle}</span>
          </h2>

          {folderId && (
            <Link
              href={`/profile/${id}`}
              className="text-brand-light hover:text-brand text-sm underline transition-colors"
            >
              View all notes
            </Link>
          )}
        </div>

        <FolderProvider folders={viewerFolders}>
          <Panel ariaLabelledBy="notes-heading" className="p-8">
            <Suspense
              key={`${query}-${sort}-${folderId}`}
              fallback={<LoadingSkeleton text="Loading notes..." />}
            >
              <ProfileNotesFetcher
                profileId={id}
                query={query}
                sort={sort}
                folderId={folderId}
                viewerId={viewerId}
              />
            </Suspense>
          </Panel>
        </FolderProvider>
      </div>
    </div>
  );
}

// ============================================================================
// SERVER COMPONENTS (abstracted fetching for Suspense to work)
// ============================================================================

async function ProfileFoldersFetcher({
  profileId,
  query,
}: {
  profileId: string;
  query?: string;
}) {
  const folders = await getFoldersByUserId(profileId, query);

  if (!folders || folders.length === 0) {
    return (
      <div className="border-brand-light/40 text-brand-light flex h-32 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-sm">
        <span>
          {query
            ? `No public folders matching "${query}".`
            : "No public folders yet."}
        </span>
      </div>
    );
  }

  return (
    <FolderList
      newFolderBtn={false}
      folders={folders}
      page="profile"
      query={query}
    />
  );
}

async function ProfileNotesFetcher({
  profileId,
  query,
  sort,
  folderId,
  viewerId,
}: {
  profileId: string;
  query?: string;
  sort?: string;
  folderId?: string;
  viewerId: string | null;
}) {
  const notes = await getNotesByUserId(profileId, query, sort, folderId);

  if (!notes || notes.length === 0) {
    return (
      <div className="border-brand-light/40 text-brand-light flex h-32 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-sm">
        <span>
          {query
            ? `No public notes matching "${query}".`
            : "No public notes yet."}
        </span>
      </div>
    );
  }

  return <NotesGrid notes={notes} userId={viewerId || ""} page="profile" />;
}

function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      className="flex flex-col items-center py-10"
      role="status"
      aria-live="polite"
    >
      <p className="text-brand-light animate-pulse">{text}</p>
    </div>
  );
}
