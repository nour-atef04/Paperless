"use client";

import { useState, useTransition } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa6";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import { createFolder } from "@/app/_lib/actions";
import FormInput from "../ui/FormInput";
import ModalActionBtns from "./ModalActionsBtns";

export default function NewFolderBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    startTransition(async () => {
      console.log(folderName);
      const result = await createFolder(folderName);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Folder created!");
      }
      setFolderName("");
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-primary flex items-center gap-2 self-center rounded-md p-3"
      >
        <FaPlus aria-hidden="true" />
        New Folder
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FormInput
              id="folderName"
              label="Folder Name"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Architecture Concepts"
              disabled={isPending}
              variant="variant2"
              showLabel={true}
              autoFocus
            />
          </div>
          
          <ModalActionBtns
            onCancel={() => setIsModalOpen(false)}
            isPending={isPending}
            isSubmitDisabled={!folderName.trim()}
            submitText="Create"
            loadingText="Creating..."
          />
        </form>
      </Modal>
    </>
  );
}
