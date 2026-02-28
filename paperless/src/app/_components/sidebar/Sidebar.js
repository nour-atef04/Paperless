"use client";

import Link from "next/link";
import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaBars, FaRegBookmark, FaTimes } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import Logo from "../ui/Logo";
import Panel from "../ui/Panel";
import NavLink from "./NavLink";
import UserAccount from "./UserAccount";
import NewNoteButton from "../ui/NewNoteButton";

export default function Sidebar({ userName, userAvatar }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Panel
      ariaLabel="Main sidebar"
      className={`${isOpen ? "h-44" : "h-20"} flex flex-wrap items-center gap-4 overflow-hidden p-4 transition-all duration-300 md:h-full md:flex-col md:flex-nowrap md:items-start md:justify-start md:gap-8 md:p-6`}
    >
      {/* Toggle and logo */}
      <div className="flex items-center gap-4 md:w-full">
        <button
          aria-label={isOpen ? "Close sidebar menu" : "Open sidebar menu"}
          aria-expanded={isOpen}
          aria-controls="sidebar-nav"
          onClick={() => setIsOpen((prev) => !prev)}
          className="focus-ring-primary text-brand-light hover:text-brand cursor-pointer rounded-sm text-xl md:hidden"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <header>
          <Link
            href="/"
            className="md:border-b-background flex flex-1 items-center gap-2 md:border-b-2 md:pb-6"
          >
            <Logo />
          </Link>
        </header>
      </div>

      {/* New note btn */}
      <NewNoteButton />

      {/* Profile pic */}
      <div className="shrink-0 md:order-last md:mt-auto md:ml-0 md:w-full">
        <UserAccount image={userAvatar} name={userName} />
      </div>

      {/* Navigation */}
      <nav
        id="sidebar-nav"
        onClick={() => setIsOpen(false)}
        className={`${isOpen ? "flex" : "hidden"} border-brand-light/10 order-4 flex w-full flex-row items-center justify-around border-t pt-4 md:flex md:flex-col md:items-start md:justify-start md:gap-6 md:border-none md:pt-0`}
      >
        <NavLink href="/notes">
          <MdOutlineDashboard aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink href="/my-notes">
          <CgNotes aria-hidden="true" />
          My Notes
        </NavLink>
        <NavLink href="/saved">
          <FaRegBookmark aria-hidden="true" /> Saved
        </NavLink>
      </nav>
    </Panel>
  );
}
