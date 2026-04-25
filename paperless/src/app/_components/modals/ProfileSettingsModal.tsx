"use client";

import React, { useActionState, useRef, useState } from "react";
import Modal from "../../_components/ui/Modal";
import FormInput from "../../_components/ui/FormInput";
import ModalActionBtns from "../buttons/ModalActionsBtns";
import Image from "next/image";
import LogoutBtn from "../buttons/LogoutBtn";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateProfileAction } from "@/app/_lib/actions";

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
  const [previewUrl, setPreviewUrl] = useState<string>(image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // live image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // client action wrapper (in client so we can close the modal)
  const handleAction = async (prevState: any, formData: FormData) => {
    try {
      await updateProfileAction(formData);

      // client side-effects
      toast.success("Profile updated successfully!");
      router.refresh();
      onClose();

      return { success: true };
    } catch (error) {
      toast.error("Failed to update profile.");
      return { error: "Failed to update profile." };
    }
  };

  // pass wrapper to the hook (to get isPending)
  const [, formAction, isPending] = useActionState(handleAction, null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <form action={formAction} className="flex flex-col gap-5">
        <div className="mb-2 flex items-center gap-4">
          {previewUrl ? (
            <Image
              src={previewUrl}
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

          <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
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
