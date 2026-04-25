import FolderList from "@/app/_components/folder/FolderList";
import NotesGrid from "@/app/_components/notes/NotesGrid";
import NotesList from "@/app/_components/notes/NotesList";
import Panel from "@/app/_components/ui/Panel";
import { FolderProvider } from "@/app/_context/FolderContext";
import {
  getFoldersByUserId,
  getNotesByUserId,
  getUserId,
  getUserProfileById,
} from "@/app/_lib/data-service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folderId?: string }>;
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = await params;
  const { folderId } = await searchParams;

  // fetch the core profile data
  const [user, folders, notes, viewerId] = await Promise.all([
    getUserProfileById(id),
    getFoldersByUserId(id),
    getNotesByUserId(id, undefined, undefined, folderId),
    getUserId(),
  ]);

  if (!user) {
    notFound();
  }

  const viewerFolders = viewerId ? await getFoldersByUserId(viewerId) : [];

  const selectedFolder = folderId
    ? folders?.find((f) => f.id === folderId)
    : null;
  const folderNameTitle = selectedFolder ? ` / ${selectedFolder.name}` : "";

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

            {/* share button for the future */}
            {/* <button className="border-brand-light/30 text-brand hover:bg-brand-light/10 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
              Share Profile
            </button> */}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2
          id="folders-heading"
          className="text-brand-dark border-brand-light/20 border-b pb-2 text-xl font-semibold"
        >
          Public Folders
        </h2>

        <Panel ariaLabelledBy="folders-heading" className="p-6">
          {!folders || folders.length === 0 ? (
            <div className="border-brand-light/40 text-brand-light flex h-32 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 opacity-50"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
              </svg>
              <span>No public folders yet.</span>
            </div>
          ) : (
            <FolderList newFolderBtn={false} folders={folders} page="profile" />
          )}
        </Panel>
      </div>

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

        {/* wrap with FolderProvider since we bypassed NotesTemplate */}
        <FolderProvider folders={viewerFolders}>
          <Panel ariaLabelledBy="notes-heading" className="p-8">
            {!notes || notes.length === 0 ? (
              <div className="border-brand-light/40 text-brand-light flex h-32 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 opacity-50"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                </svg>
                <span>No public notes yet.</span>
              </div>
            ) : (
              <NotesGrid notes={notes} userId={viewerId} page="profile" />
            )}
          </Panel>
        </FolderProvider>
      </div>
    </div>
  );
}
