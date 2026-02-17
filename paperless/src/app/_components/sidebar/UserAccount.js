import Image from "next/image";

export default function UserAccount({ name, image }) {
  return (
    <section className="md:border-t-background ml-auto shrink-0 items-center md:mt-auto md:ml-0 md:flex md:w-full md:items-center md:gap-3 md:border-t-2 md:pt-6">
      <Image
        src={image}
        width={50}
        height={40}
        alt="User avatar"
        className="rounded-md"
      />
      <span className="hidden md:inline">{name}</span>
    </section>
  );
}
