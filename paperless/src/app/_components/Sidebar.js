import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <section className="bg-surface flex h-20 items-center justify-between rounded-md pr-6 shadow-sm md:h-full md:flex-col md:items-center md:justify-start md:gap-10 md:px-2">
      <header>
        <Image
          src="/logo.png"
          alt="Paperless logo"
          width={200}
          height={40}
          priority
          className="border-b-2 border-b-background"
        />
      </header>

      <nav className="flex gap-5 md:flex-col md:items-center">
        <Link href="/">Home</Link>
        <Link href="/notes">Notes</Link>
      </nav>
    </section>
  );
}
