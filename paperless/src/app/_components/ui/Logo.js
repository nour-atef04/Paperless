import Image from "next/image";

export default function Logo({
  className,
  variant = "light-mode", // "dark-mode" || "light-mode"
}) {
  return (
    <div className={`${className} flex items-center gap-2`}>
      <Image
        src={`/logo${variant === "dark-mode" ? "-dark-mode" : ""}.png`}
        alt="Paperless logo"
        width={40}
        height={40}
        priority
        className="shrink-0 object-contain"
      />
      <Image
        src={`/logo-title${variant === "dark-mode" ? "-dark-mode" : ""}.png`}
        alt="Paperless logo title"
        width={120}
        height={40}
        priority
        className={"hidden shrink-0 object-contain sm:inline"}
      />
    </div>
  );
}
