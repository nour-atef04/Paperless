"use client";

import Image from "next/image";
import { useState } from "react";
import ProfileSettingsModal from "../modals/ProfileSettingsModal";

type UserAccountProps = {
  name: string;
  image: string | null;
  email?: string;
};

export default function UserAccount({ name, image, email }: UserAccountProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="md:border-t-brand ml-auto shrink-0 items-center md:mt-auto md:ml-0 md:flex md:w-full md:items-center md:gap-3 md:border-t-2 md:pt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="focus-visible:ring-brand-light cursor-pointer rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Open account settings"
        >
          <Image
            src={image}
            width={50}
            height={40}
            alt={`${name}'s avatar`}
            className="rounded-md"
          />
        </button>

        <span className="text-surface hidden md:inline">{name}</span>
      </div>
      <ProfileSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        email={email || "user@example.com"}
      />
    </>
  );
}
