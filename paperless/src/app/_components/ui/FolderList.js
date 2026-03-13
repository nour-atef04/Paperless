"use client";

import Image from "next/image";
import { useState } from "react";

export default function FolderList() {
  const fakeFolders = [
    { id: 1, name: "Architecture Concepts" },
    { id: 2, name: "Web Dev Snippets" },
    { id: 3, name: "Personal Plans" },
    { id: 4, name: "Web Dev Snippets" },
    { id: 5, name: "Personal Plans" },
    { id: 6, name: "Architecture Concepts" },
    { id: 7, name: "Web Dev Snippets" },
    { id: 8, name: "Personal Plans" },
    { id: 9, name: "Architecture Concepts" },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleFolders = isExpanded ? fakeFolders : fakeFolders.slice(0, 7);
  const hasMore = fakeFolders.length > 5;

  return (
    <>
      {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4"> */}
      <div className="flex flex-wrap gap-4">
        {visibleFolders.map((folder) => (
          <button
            key={folder.id}
            className="focus-visible:ring-brand-light group border-brand-light/20 flex shrink-0 cursor-pointer items-center gap-3 rounded-lg border p-3 pr-6 transition-all hover:-translate-y-1 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
            aria-label={`Open ${folder.name} folder`}
          >
            <Image
              src="/folder-icon.png"
              alt=""
              quality={100}
              width={32}
              height={32}
              priority
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-brand font-medium tracking-wide">
              {folder.name}
            </span>
          </button>
        ))}

        {hasMore && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-brand-light hover:bg-brand-light/10 border-brand-light/40 flex cursor-pointer items-center justify-center rounded-lg border border-dashed p-3 transition-colors"
          >
            + {fakeFolders.length - 5} More
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
