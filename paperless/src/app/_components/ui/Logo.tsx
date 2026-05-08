import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "light-mode" | "dark-mode";
  size?: "small" | "large";
};

export default function Logo({
  className = "",
  variant = "light-mode",
  size = "large",
}: LogoProps) {
  const iconDim = size === "small" ? 28 : 40;
  const titleWidth = size === "small" ? 84 : 120;
  const titleHeight = size === "small" ? 28 : 40;

  return (
    <div className={`${className} flex items-center gap-2`}>
      <Image
        src={`/logo${variant === "dark-mode" ? "-dark-mode" : ""}.png`}
        alt="Paperless logo"
        width={iconDim}
        height={iconDim}
        priority
        className="shrink-0 object-contain"
      />
      <Image
        src={`/logo-title${variant === "dark-mode" ? "-dark-mode" : ""}.png`}
        alt="Paperless logo title"
        width={titleWidth}
        height={titleHeight}
        priority
        className={"hidden shrink-0 object-contain sm:inline"}
      />
    </div>
  );
}
