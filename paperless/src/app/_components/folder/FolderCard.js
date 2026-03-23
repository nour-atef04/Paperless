import Image from "next/image";
import Link from "next/link";
import FolderActionsBtn from "../buttons/FolderActionsBtn";
import FolderOptionsList from "./FolderOptionsList";

export default function FolderCard({
  folder,
  openOptionsId,
  setOpenOptionsId,
}) {
  const isOpen = openOptionsId === folder.id;

  return (
    <div
      className={`focus-within:ring-brand-light px-2 group border-brand-light/20 relative flex shrink-0 items-center justify-between gap-1 rounded-lg border pr-2 transition-all focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-sm ${
        isOpen ? "z-50" : ""
      }`}
    >
      <Link
        href={`/my-notes?folder=${folder.id}`}
        className="flex items-center gap-3 p-3 outline-none"
        aria-label={`Open ${folder.name} folder`}
      >
        <Image
          src="/folder-icon.png"
          alt=""
          quality={100}
          width={32}
          height={32}
          priority
          className="transition-transform duration-200 group-hover:scale-110"
        />
        <span className="text-brand font-medium tracking-wide">
          {folder.name}
        </span>
      </Link>

      <FolderActionsBtn
        folderId={folder.id}
        folderName={folder.name}
        setOpenOptionsId={setOpenOptionsId}
        isOpen={isOpen}
      />

      {isOpen && <FolderOptionsList closeMenu={() => setOpenOptionsId(null)} />}
    </div>
  );
}
