import Sidebar from "../_components/sidebar/Sidebar";
import { getUserProfile } from "../_lib/data-service";
import type { Metadata } from "next";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    template: "%s | Paperless",
    default: "Paperless - The Smart Study App",
  },
  description: "Organize, summarize, and study your markdown notes with AI.",
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const profile = await getUserProfile();

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] md:grid-cols-[250px_1fr] md:grid-rows-none">
      <a
        href="#main-content"
        className="focus:bg-brand sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar profile={profile} />
      <main id="main-content" className="overflow-auto pt-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
