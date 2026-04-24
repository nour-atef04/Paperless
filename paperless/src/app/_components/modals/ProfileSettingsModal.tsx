"use client";

import { useState } from "react";
import Modal from "../../_components/ui/Modal";
import FormInput from "../../_components/ui/FormInput";
import ModalActionBtns from "../buttons/ModalActionsBtns";

type ProfileSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  email?: string;
};

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  name = "",
  email = "",
}: ProfileSettingsModalProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    // call action
  };

  const handleLogOut = async () => {
    console.log("Logging out...");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-brand flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <button
            type="button"
            className="text-brand hover:text-brand-light cursor-pointer text-sm underline"
          >
            Change Picture
          </button>
        </div>

        <FormInput
          name="fullName"
          id="fullName"
          label="Full Name"
          type="text"
          showLabel={true}
          variant="variant2" 
          defaultValue={name}
        />

        <FormInput
          name="email"
          id="email"
          label="Email Address"
          type="email"
          showLabel={true}
          variant="variant2"
          defaultValue={email}
          disabled
          className="opacity-60"
        />

        <div className="mt-4 flex items-center justify-between border-t border-brand-light/20 pt-4">
          <button
            type="button"
            onClick={handleLogOut}
            className=" text-sm font-medium text-red-700 hover:text-red-700 hover:underline cursor-pointer"
          >
            Log Out
          </button>

          <ModalActionBtns
            onCancel={onClose}
            isPending={isPending}
            submitText="Save Changes"
          />
        </div>
      </form>
    </Modal>
  );
}