"use client";

import { useFolders } from "@/app/_context/FolderContext";
import { NoteWithDetails } from "@/app/_lib/types";
import { useState } from "react";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import FormInput from "../ui/FormInput";
import Modal from "../ui/Modal";
import OptionsList from "../ui/OptionsList";

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

  const noteOptions = [
    {
      label: "Move",
      onClick: () => {
        setOpenModal("Move Folder");
      },
    },
    {
      label: "Copy",
      onClick: () => {
        setOpenModal("Copy Folder");
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
          <form className="flex flex-col gap-6">
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
              onSubmit={() => console.log("submitted")}
              onCancel={() => setOpenModal(null)}
              isSubmitDisabled={!selectedFolderId}
              submitText={openModal === "Move Folder" ? "Move" : "Copy"}
              // when i write the Server Action, pass isPending={isPending} here
              // and loadingText={openModal === "Move Folder" ? "Moving..." : "Copying..."}
            />
          </form>
        </Modal>
      )}
    </>
  );
}
