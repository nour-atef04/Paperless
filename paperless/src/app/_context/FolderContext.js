"use client";

import { createContext, useContext } from "react";

const FolderContext = createContext([]);

export function FolderProvider({ children, folders }) {
  return (
    <FolderContext.Provider value={folders}>{children}</FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolders must be within a FolderProvider");
  }
  return context;
}
