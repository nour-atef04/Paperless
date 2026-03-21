"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FolderList({folders}) {

  const [isExpanded, setIsExpanded] = useState(false);

  if (!folders || folders.length === 0) {
    return <p className="text-brand-light/70 text-sm">No folders created yet.</p>;
  }

  const visibleFolders = isExpanded ? folders : folders.slice(0, 5);
  const hasMore = folders.length > 5;

  return (
    <>
      {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4"> */}
      <div className="flex flex-wrap gap-4">
        {visibleFolders.map((folder) => (
          <Link
            key={folder.id}
            href={`/my-notes?folder=${folder.id}`}
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
          </Link>
        ))}

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
