import { useOutsideClick } from "@/app/_hooks/useOutsideClick";

export default function FolderOptionsList({ closeMenu }) {
  const ref = useOutsideClick(closeMenu);

  return (
    <div
      ref={ref}
      role="menu"
      className="bg-surface absolute py-2 top-10 right-3 z-10 flex gap-2 rounded-sm border border-gray-200 text-sm shadow"
    >
      <button
        role="menuitem"
        className="z-10 text-brand w-full cursor-pointer rounded-sm px-4 text-left text-sm transition-colors"
        onClick={(e) => {
          e.preventDefault();
          // TODO: Open Rename Modal
          closeMenu();
        }}
      >
        Rename
      </button>
      <button
        role="menuitem"
        className="z-10 w-full cursor-pointer rounded-sm px-4 text-left text-sm transition-colors"
        onClick={(e) => {
          e.preventDefault();
          // TODO: Open Delete Modal
          closeMenu();
        }}
      >
        Delete
      </button>
    </div>
  );
}
