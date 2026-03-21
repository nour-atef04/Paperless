"use client";

import { useState, useTransition } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa6";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";

export default function NewFolderBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    startTransition(async () => {
      // 1. Call your server action (we will write this next)
      // const result = await createFolder(folderName);
      // 2. Handle the result
      // if (result?.error) {
      //   toast.error(result.error);
      // } else {
      //   toast.success("Folder created!");
      //   setFolderName("");
      //   setIsModalOpen(false);
      // }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-primary flex items-center gap-2 self-center rounded-md p-3"
      >
        <FaPlus />
        New Folder
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="folderName" className="text-sm font-medium">
              Folder Name
            </label>
            <input
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Architecture Concepts"
              disabled={isPending}
              className="border-brand-light/30 rounded-md border bg-transparent p-2"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="text-brand-light cursor-pointer px-4 py-2 text-sm hover:underline disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !folderName.trim()}
              className={`${isPending || !folderName.trim() ? "cursor-not-allowed" : "cursor-pointer"} btn-primary flex items-center justify-center rounded-md px-4 py-2 disabled:opacity-50`}
            >
              {isPending ? <FaSpinner className="animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
