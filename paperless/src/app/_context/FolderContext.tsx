"use client";

import React, { createContext, useContext } from "react";
import { Folder, FolderType } from "../_lib/types";

const FolderContext = createContext<Folder[] | undefined>(undefined);

type FolderProviderProps = {
  children: React.ReactNode;
  folders: Folder[];
};

export function FolderProvider({ children, folders }: FolderProviderProps) {
  return (
    <FolderContext.Provider value={folders}>{children}</FolderContext.Provider>
  );
}

export function useFolders(typeFilter?: FolderType) {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolders must be within a FolderProvider");
  }
  if (typeFilter) {
    return context.filter((folder) => folder.folder_type === typeFilter);
  }
  return context;
}
