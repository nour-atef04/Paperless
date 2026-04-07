"use client";

import { deleteNote } from "@/app/_lib/actions";
import { useState, useTransition } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ModalActionBtns from "./ModalActionsBtns";

export default function DeleteNoteBtn({ note }) {
  const [isDeleting, startDeleting] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    startDeleting(async () => {
      const result = await deleteNote(note.id);

      if (result?.error) {
        setIsModalOpen(false);
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        setIsModalOpen(false);
        toast.success("Note deleted!");

        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      }
    });
  };

  return (
    <>
      <button
        onClick={openModal}
        disabled={isDeleting}
        aria-label={`Delete note: ${note.title}`}
        className="focus-ring-primary relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm"
      >
        {isDeleting ? (
          <FaSpinner className="text-brand animate-spin text-xl" />
        ) : (
          <IoTrashOutline
            aria-hidden="true"
            className="text-brand absolute text-xl transition-transform hover:scale-110"
          />
        )}
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isDeleting && setIsModalOpen(false)}
        title="Delete Note"
      >
        <div className="space-y-4">
          <p className="text-brand-light">
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
          <ModalActionBtns
            onCancel={() => setIsModalOpen(false)}
            onSubmit={confirmDelete}
            isPending={isDeleting}
            submitText="Delete Permanently"
            loadingText="Deleting..."
          />
        </div>
      </Modal>
    </>
  );
}
