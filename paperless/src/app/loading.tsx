import { VscLoading } from "react-icons/vsc";

export default function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-[80vh] w-full items-center justify-center"
    >
      <VscLoading className="text-brand h-10 w-10 animate-spin" />
    </div>
  );
}
