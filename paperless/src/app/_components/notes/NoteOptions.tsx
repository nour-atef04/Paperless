"use client";

import { useFolders } from "@/app/_context/FolderContext";
import { copyNote, moveNote, toggleNoteVisibility } from "@/app/_lib/actions";
import { NoteWithDetails } from "@/app/_lib/types";
import { useActionState, useState } from "react";
import toast from "react-hot-toast";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import FormInput from "../ui/FormInput";
import Modal from "../ui/Modal";
import OptionsList from "../ui/OptionsList";
import VisibilityModal from "../modals/VisibilityModal";

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
  const [openModal, setOpenModal] = useState<string | null>(null); // for move/copy modal
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false); // for visibility
  const [selectedFolderId, setSelectedFolderId] = useState(""); // track what the user selects in the dropdown

  const folders = useFolders().filter((folder) => folder.id !== note.folder_id);

  // --- MOVE / COPY ---
  // action handler (wrapper) to route to correct server action
  const handleMoveCopy = async (prevState: any, formData: FormData) => {
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
  const [, moveCopyAction, isPending] = useActionState(handleMoveCopy, null);

  // --- VISBILITY ---
  const handleVisibility = async (prevState: any, formData: FormData) => {
    const willBePublic = !note.public;
    const res = await toggleNoteVisibility(note.id, willBePublic);
    if (res?.error) {
      toast.error(res.error);
      return res;
    }

    toast.success(`Note is now ${willBePublic ? "Public" : "Private"}!`);
    setIsVisibilityModalOpen(false);
    setOpenOptionsId(null);
    return res;
  };

  const [, visibilityAction, isVisibilityPending] = useActionState(
    handleVisibility,
    null,
  );

  // --- MENU OPTIONS ---
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
    {
      label: note.public ? "Make Private" : "Make Public",
      onClick: () => {
        setIsVisibilityModalOpen(true);
      },
    },
  ];

  return (
    <>
      {isOpen && (
        <OptionsList
          className="right-0 bottom-8"
          options={noteOptions}
          closeMenu={() => setOpenOptionsId(null)}
        />
      )}

      {/* --- MOVE / COPY --- */}
      {openModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setOpenModal(null);
            setSelectedFolderId("");
          }}
          title={openModal}
        >
          <form action={moveCopyAction} className="flex flex-col gap-6">
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

      {/* --- VISIBILITY MODAL --- */}
      {isVisibilityModalOpen && (
        <VisibilityModal
          isPublic={note.public}
          isPending={isVisibilityPending}
          action={visibilityAction}
          variant="note"
          onClose={() => setIsVisibilityModalOpen(false)}
          isParentFolderPrivate={note.folders ? !note.folders.public : false}
          parentFolderName={note.folders?.name}
        />
      )}
    </>
  );
}
