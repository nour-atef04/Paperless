"use client";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function FolderActionsBtn({
  folderId,
  folderName,
  isOpen,
  setOpenOptionsId,
}) {
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setOpenOptionsId((prev) => (prev === folderId ? null : folderId));
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Options for ${folderName} folder`}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="text-brand focus-ring-primary relative z-10 cursor-pointer rounded-full p-2 transition hover:bg-gray-200"
    >
      <BsThreeDotsVertical aria-hidden="true" />
    </button>
  );
}
