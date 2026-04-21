"use client";
import { BsThreeDotsVertical } from "react-icons/bs";

type ActionsBtnProps = {
  id: string | number;
  name: string;
  isOpen: boolean;
  setOpenOptionsId: (id: string | number | null) => void;
  variant?: "folder" | "note";
};

export default function ActionsBtn({
  id,
  name,
  isOpen,
  setOpenOptionsId,
  variant = "folder",
}: ActionsBtnProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setOpenOptionsId(isOpen ? null : id);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Options for ${name} ${variant}`}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="text-brand-dark focus-ring-primary relative z-10 cursor-pointer rounded-full p-2 transition hover:bg-gray-200"
    >
      <BsThreeDotsVertical aria-hidden="true" />
    </button>
  );
}
