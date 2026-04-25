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
import Link from "next/link";
import { UserProfile } from "@/app/_lib/types";

type ProfileSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
};

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  profile,
}: ProfileSettingsModalProps) {
  // console.log(profile)

  const name = profile?.name || "User";
  const image = profile?.image || "/default-user.jpg";
  const email = profile?.email || "";
  const id = profile?.id || "";

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
        <div className="mb-4 flex items-center gap-4">
          {/* 1. The Avatar Circle */}
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile Picture"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="bg-brand flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-col items-start gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-brand hover:text-brand-dark cursor-pointer text-sm font-medium transition-colors hover:underline"
            >
              Change Picture
            </button>

            <Link
              href={`profile/${id}`}
              onClick={onClose}
              className="text-brand-light hover:text-brand flex items-center gap-1.5 text-xs transition-colors hover:underline"
            >
              View public profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </Link>
          </div>
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
