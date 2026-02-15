import Image from "next/image";

export default function UserAccount({ name, image, isOpen }) {
  return (
    <section
      className={`${isOpen ? "mt-auto w-full flex items-center gap-3" : ""} md:border-t-background ml-auto md:mt-auto md:ml-0 md:flex md:w-full md:items-center md:gap-3 md:border-t-2 md:pt-6`}
    >
      <Image
        src={image}
        width={50}
        height={40}
        alt="User avatar"
        className="rounded-md"
      />
      <span className={`${isOpen ? "inline" : "hidden"} hidden md:inline`}>
        {name}
      </span>
    </section>
  );
}
