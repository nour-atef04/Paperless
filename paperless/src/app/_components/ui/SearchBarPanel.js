import FormInput from "./FormInput";
import Panel from "./Panel";
import { IoMdSearch } from "react-icons/io";

export default function SearchBarPanel({ className }) {
  return (
    <Panel className={`${className} flex items-center gap-3 p-4`}>
      <IoMdSearch className="text-2xl text-brand-light" />
      <FormInput className="w-full" placeholder="Search notes..." />
    </Panel>
  );
}
