"use client";

import Image from "next/image";
import Link from "next/link";
import FolderActionsBtn from "../buttons/FolderActionsBtn";
import FolderOptionsList from "./FolderOptionsList";
import { useState, useTransition } from "react";
import { deleteFolder } from "@/app/_lib/actions";
import { FaSpinner } from "react-icons/fa";
import Modal from "../ui/Modal";

export default function FolderCard({
  folder,
  openOptionsId,
  setOpenOptionsId,
}) {
  const isOpen = openOptionsId === folder.id;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, startDeleting] = useTransition();

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

        <FolderActionsBtn
          folderId={folder.id}
          folderName={folder.name}
          setOpenOptionsId={setOpenOptionsId}
          isOpen={isOpen}
        />

        {isOpen && (
          <FolderOptionsList
            folder={folder}
            closeMenu={() => setOpenOptionsId(null)}
            onOpenDelete={() => setIsDeleteModalOpen(true)}
            onOpenRename={() => console.log("Rename!")}
          />
        )}
      </div>

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
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-brand-light cursor-pointer px-4 py-2 text-sm underline"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              className="btn-primary rounded-md p-2"
              onClick={confirmDelete}
              aria-live="polite"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" aria-hidden="true" />
                  <span>Deleting...</span>
                </span>
              ) : (
                "Delete Permanently"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
