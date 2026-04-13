"use client";

import { deleteFolder, renameFolder } from "@/app/_lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import ActionsBtn from "../buttons/ActionsBtn";
import Modal from "../ui/Modal";
import OptionsList from "../ui/OptionsList";
import FormInput from "../ui/FormInput";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import { Folder } from "@/app/_lib/types";

type FolderCardProps = {
  folder: Folder;
  openOptionsId: string | null;
  setOpenOptionsId: (id: string | null) => void;
};

export default function FolderCard({
  folder,
  openOptionsId,
  setOpenOptionsId,
}: FolderCardProps) {
  const isOpen = openOptionsId === folder.id; // for options

  const [newFolderName, setNewFolderName] = useState(folder.name);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [isDeleting, startDeleting] = useTransition();
  const [isRenaming, startRenaming] = useTransition();

  const confirmDelete = () => {
    startDeleting(async () => {
      const result = await deleteFolder(folder.id);

      if (result?.error) {
        setIsDeleteModalOpen(false);
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        setIsDeleteModalOpen(false);
        toast.success("Folder deleted!");
      }
    });
  };

  const handleRename = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newFolderName.trim() || newFolderName === folder.name) return;

    startRenaming(async () => {
      const result = await renameFolder(folder.id, newFolderName);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Folder renamed!");
        setIsRenameModalOpen(false);
      }
    });
  };

  // drop down options
  const folderOptions = [
    {
      label: "Rename",
      onClick: () => setIsRenameModalOpen(true),
    },
    {
      label: "Delete",
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  return (
    <>
      <div
        className={`focus-within:ring-brand-light group border-brand-light/20 relative flex shrink-0 items-center justify-between gap-1 rounded-lg border px-2 pr-2 transition-all focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-sm ${
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

        <ActionsBtn
          id={folder.id}
          name={folder.name}
          setOpenOptionsId={setOpenOptionsId}
          isOpen={isOpen}
        />

        {isOpen && (
          <OptionsList
            className="top-10 right-3"
            closeMenu={() => setOpenOptionsId(null)}
            options={folderOptions}
          />
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Folder"
      >
        <div className="space-y-4">
          <p className="text-brand-light">
            Are you sure you want to delete this folder? This action cannot be
            undone.
          </p>
          <ModalActionBtns
            onCancel={() => setIsDeleteModalOpen(false)}
            onSubmit={confirmDelete}
            isPending={isDeleting}
            submitText="Delete Permanently"
            loadingText="Deleting..."
          />
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => !isRenaming && setIsRenameModalOpen(false)}
        title="Rename Folder"
      >
        <form onSubmit={handleRename} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <FormInput
              label="New Folder Name"
              showLabel={true}
              variant="variant2"
              id="newFolderName"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              disabled={isRenaming}
              autoFocus
            />
          </div>

          <ModalActionBtns
            onSubmit={() => console.log("submitted!")}
            onCancel={() => setIsRenameModalOpen(false)}
            isPending={isRenaming}
            isSubmitDisabled={
              isRenaming ||
              folder.name.trim() === newFolderName.trim() ||
              !newFolderName.trim()
            }
            submitText="Rename"
            loadingText="Renaming..."
          />
        </form>
      </Modal>
    </>
  );
}
