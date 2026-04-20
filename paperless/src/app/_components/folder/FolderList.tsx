"use client";

import { useState } from "react";
import NewFolderBtn from "../buttons/NewFolderBtn";
import FolderCard from "./FolderCard";
import { Folder } from "@/app/_lib/types";

type FolderListProps = {
  folders: Folder[];
};

export default function FolderList({ folders }: FolderListProps) {
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleFolders = isExpanded ? folders : folders.slice(0, 5);
  const hasMore = folders.length > 5;

  return (
    <>
      {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4"> */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* <button className="btn-primary px-5 rounded-md">+ New Folder</button> */}
        <NewFolderBtn />
        {!folders || folders.length === 0 ? (
          <p className="text-brand-light/70 text-sm">No folders created yet.</p>
        ) : (
          visibleFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              openOptionsId={openOptionsId}
              setOpenOptionsId={setOpenOptionsId}
            />
          ))
        )}

        {hasMore && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-brand-light hover:bg-brand-light/10 border-brand-light/40 flex cursor-pointer items-center justify-center rounded-lg border border-dashed p-3 transition-colors"
          >
            + {folders.length - 5} More
          </button>
        )}
      </div>

      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-brand-light hover:text-brand cursor-pointer self-start text-sm underline"
        >
          Show Less
        </button>
      )}
    </>
  );
}
