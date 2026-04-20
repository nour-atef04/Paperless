"use client";

import { useFolders } from "@/app/_context/FolderContext";
import { NoteWithDetails } from "@/app/_lib/types";
import { useActionState, useEffect, useState } from "react";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import FormInput from "../ui/FormInput";
import Modal from "../ui/Modal";
import OptionsList from "../ui/OptionsList";
import { copyNote, moveNote } from "@/app/_lib/actions";
import toast from "react-hot-toast";

type NoteOptionsProps = {
  setOpenOptionsId: (id: string | null) => void;
  isOpen: boolean;
  note: NoteWithDetails;
};

export default function NoteOptions({
  setOpenOptionsId,
  isOpen,
  note,
}: NoteOptionsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState(""); // track what the user selects in the dropdown

  const folders = useFolders().filter((folder) => folder.id !== note.folder_id);

  // action handler (wrapper) to route to correct server action
  const handleAction = async (prevState: any, formData: FormData) => {
    if (!selectedFolderId) {
      toast.error("Please select a destination folder.");
      return { error: "Please select a destination folder." };
    }

    const isMoving = openModal === "Move Note";

    const res = isMoving
      ? await moveNote(note.id, selectedFolderId)
      : await copyNote(note.id, selectedFolderId);

    if (res?.error) {
      toast.error(res.error);
      return res;
    }

    toast.success(`Note ${isMoving ? "moved" : "copied"} successfully!`);

    setOpenModal(null);
    setSelectedFolderId("");
    setOpenOptionsId(null);

    return res;
  };

  // grab isPending
  const [, formAction, isPending] = useActionState(handleAction, null);

  const noteOptions = [
    {
      label: "Move",
      onClick: () => {
        setOpenModal("Move Note");
      },
    },
    {
      label: "Copy",
      onClick: () => {
        setOpenModal("Copy Note");
      },
    },
  ];

  return (
    <>
      {isOpen && (
        <OptionsList
          className="right-0"
          options={noteOptions}
          closeMenu={() => setOpenOptionsId(null)}
        />
      )}
      {openModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setOpenModal(null);
            setSelectedFolderId("");
          }}
          title={openModal}
        >
          <form action={formAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <FormInput
                showLabel={true}
                label="Current Folder"
                variant="variant2"
                id="current-folder"
                disabled
                value={note.folders?.name || "None"}
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormInput
                showLabel={true}
                label="Destination Folder"
                variant="variant2"
                id="folderId"
                name="folderId"
                selectInput={true}
                selectOptions={folders}
                placeholder="Select a Folder..."
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
              />
            </div>

            <ModalActionBtns
              onCancel={() => setOpenModal(null)}
              isSubmitDisabled={!selectedFolderId || isPending}
              isPending={isPending}
              submitText={openModal === "Move Note" ? "Move" : "Copy"}
              loadingText={
                openModal === "Move Note" ? "Moving..." : "Copying..."
              }
            />
          </form>
        </Modal>
      )}
    </>
  );
}
