import { IoMdLock } from "react-icons/io";
import { RiEarthFill } from "react-icons/ri";

type VisibilityIconProps = {
  variant: "note" | "folder";
  isPublic: boolean;
  className?: string;
};

export default function VisibilityIcon({
  variant = "note",
  isPublic,
  className,
}: VisibilityIconProps) {
  return (
    <div className={`${className || ""}`}>
      <span title={isPublic ? `Public ${variant}` : `Private ${variant}`}>
        <span aria-hidden="true">
          {isPublic ? <RiEarthFill /> : <IoMdLock />}
        </span>

        <span className="sr-only">
          {isPublic ? `Public ${variant}` : `Private ${variant}`}
        </span>
      </span>
    </div>
  );
}
