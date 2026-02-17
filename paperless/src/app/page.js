import Panel from "./_components/ui/Panel";
import SearchBarPanel from "./_components/ui/SearchBarPanel";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel className="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 p-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-brand h-40 rounded-md"></div>
        ))}
      </Panel>
    </div>
  );
}
