"use client";

import { deleteNote } from "@/app/_lib/actions";
import { useState, useTransition } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";
import Modal from "./Modal";

export default function DeleteNoteBtn({ note }) {
  const [isDeleting, startDeleting] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    startDeleting(async () => {
      try {
        // TODO: DELETE CONFIRMATION MODAL
        await deleteNote(note.id);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to save note: ", error);
        setIsModalOpen(false);
        // TODO: SHOW A TOAST NOTIF + GREY NOTE OUT
      }
    });
  };

  return (
    <>
      <button
        onClick={openModal}
        disabled={isDeleting}
        aria-label={`Delete note: ${note.title}`}
        className="focus-ring-primary relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm"
      >
        {isDeleting ? (
          <FaSpinner className="text-brand animate-spin text-xl" />
        ) : (
          <IoTrashOutline
            aria-hidden="true"
            className="text-brand absolute text-2xl transition-transform hover:scale-110"
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
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-brand-light cursor-pointer px-4 py-2 text-sm underline"
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
