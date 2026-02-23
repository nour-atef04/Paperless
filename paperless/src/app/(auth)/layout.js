import Logo from "../_components/ui/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#7C6F8A] bg-[radial-gradient(circle,#7C6F8A_0%,#3A314A_75%,#3A314A_100%)]">
      <header className="absolute top-0 left-0 z-10 p-8">
        <div className="hidden sm:block">
          <Logo variant="dark-mode" />
        </div>

        <div className="block sm:hidden">
          <Logo variant="light-mode" />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
