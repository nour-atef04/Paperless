import FormInput from "./FormInput";
import Panel from "./Panel";
import { IoMdSearch } from "react-icons/io";

export default function SearchBarPanel({ className }) {
  return (
    <search className={className}>
      <Panel as="form" className="flex items-center gap-3 p-4">
        <IoMdSearch aria-hidden="true" className="text-brand-light text-2xl" />
        <FormInput
          aria-label="Search notes"
          className="w-full"
          placeholder="Search notes..."
        />
      </Panel>
    </search>
  );
}
