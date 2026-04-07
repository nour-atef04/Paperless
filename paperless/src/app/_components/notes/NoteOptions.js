"use client";

import { useState } from "react";
import OptionsList from "../ui/OptionsList";
import Modal from "../ui/Modal";

export default function NoteOptions({ setOpenOptionsId, isOpen, note }) {
  const [openModal, setOpenModal] = useState(false);

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
          <form className="flex flex-col">
            <label htmlFor="current-folder">Current Folder:</label>
            <input
              disabled={true}
              defaultValue={note.folders?.name}
              id="current-folder"
            />
            <label htmlFor="new-folder">New Folder:</label>
            <input type="text" id="new-folder" />
            <div className="flex flex-col gap-2">
              <label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </label>
              <input
                id="folderName"
                type="text"
                value={folderName}
                // onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g., Architecture Concepts"
                // disabled={isPending}
                autoFocus
                className="border-brand-light/30 rounded-md border bg-transparent p-2"
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
