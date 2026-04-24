"use client";

import { useState } from "react";
import Modal from "../../_components/ui/Modal";
import FormInput from "../../_components/ui/FormInput";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import Image from "next/image";
import LogoutBtn from "../buttons/LogoutBtn";

type ProfileSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  image: string;
};

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  name,
  email,
  image,
}: ProfileSettingsModalProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    // call action
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="mb-2 flex items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt="Profile Picture"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover shadow-sm"
            />
          ) : (
            // fallback in case image fails to load or isn't passed
            <div className="bg-brand flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

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

        <div className="border-brand-light/20 mt-4 flex items-center justify-between border-t pt-4">
          <LogoutBtn />

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
