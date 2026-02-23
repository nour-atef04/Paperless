import Sidebar from "../_components/sidebar/Sidebar";
import { getUserProfile } from "../_lib/data-service";

export default async function AuthenticatedLayout({ children }) {
  const profile = await getUserProfile();
  const userName = profile?.full_name;
  const userAvatar = profile?.avatar_url || "/default-user.jpg";

  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[250px_1fr]">
      <a href="#main-content" className="sr-only">
        Skip to content
      </a>
      <Sidebar userName={userName} userAvatar={userAvatar} />
      <main id="main-content" className="overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
