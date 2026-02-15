"use client";

import Image from "next/image";
import { CgNotes } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Panel from "../Panel";
import NavLink from "./NavLink";
import UserAccount from "./UserAccount";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const mobileOpen = isOpen
    ? "fixed inset-0 z-50 h-full flex-col items-start"
    : "h-20";

  return (
    <Panel
      className={`flex items-center gap-6 p-6 transition-all duration-300 ${mobileOpen} md:static md:h-full md:flex-col md:items-start`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-brand-light hover:text-brand cursor-pointer text-xl md:hidden"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo */}
      <header className="md:border-b-background w-full md:border-b-2 md:pb-6">
        <Image
          src="/logo.png"
          alt="Paperless logo"
          width={150}
          height={40}
          priority
        />
      </header>

      {/* New Note Button */}
      <button
        className={`${isOpen ? "flex items-center gap-3" : "hidden"} bg-brand w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white transition hover:opacity-90 active:scale-[0.98] md:flex md:items-center md:gap-3`}
      >
        <FaPlus />
        New Note
      </button>

      {/* Navigation */}
      <nav
        onClick={() => setIsOpen(false)}
        className={`w-full flex-col gap-6 pt-7 ${isOpen ? "flex" : "hidden"} md:flex md:gap-8`}
      >
        <NavLink href="/">
          <MdOutlineDashboard />
          Dashboard
        </NavLink>

        <NavLink href="/notes">
          <CgNotes />
          My Notes
        </NavLink>

        <NavLink href="/saved">
          <FaRegBookmark />
          Saved Notes
        </NavLink>
      </nav>

      {/* User */}
      <UserAccount
        image="/default-user.jpg"
        name="Nour Atef"
        isOpen={isOpen}
      />
    </Panel>
  );
}
