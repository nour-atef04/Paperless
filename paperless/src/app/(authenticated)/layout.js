import Sidebar from "../_components/sidebar/Sidebar";

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[250px_1fr]">
      <a href="#main-content" className="sr-only">
        Skip to content
      </a>
      <Sidebar />
      <main id="main-content" className="overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
