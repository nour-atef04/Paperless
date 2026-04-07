"use client";

import { useState } from "react";
import OptionsList from "../ui/OptionsList";
import Modal from "../ui/Modal";
import FormInput from "../ui/FormInput";
import { useFolders } from "@/app/_context/FolderContext";

export default function NoteOptions({ setOpenOptionsId, isOpen, note }) {
  const [openModal, setOpenModal] = useState(false);

  const folders = useFolders()
    .filter((folder) => folder.id !== note.folder_id)
    .map((folder) => folder.name);

  const noteOptions = [
    {
      label: "Move",
      onClick: () => {
        setOpenModal(true);
      },
    },
    {
      label: "Copy",
      onClick: () => {
        setOpenModal(true);
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
        <Modal isOpen={true} onClose={() => setOpenModal(false)} title="Modal">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <FormInput
                showLabel={true}
                label="Current Folder"
                variant="variant2"
                id="current-folder"
                disabled
                value={note.folders?.name}
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
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
