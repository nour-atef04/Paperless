import Panel from "./_components/ui/Panel";
import PanelTitle from "./_components/ui/PanelTitle";
import SearchBarPanel from "./_components/ui/SearchBarPanel";

const notes = [
  {
    title: "Big O Notation",
    note: "Big O describes the worst-case time complexity of an algorithm. Common examples: O(1), O(log n), O(n), O(n log n), O(n^2). Used to measure scalability.",
  },
  {
    title: "Recursion Basics",
    note: "A function that calls itself. Must include a base case to stop infinite calls. Example: factorial(n) = n * factorial(n-1).",
  },
  {
    title: "Binary Search",
    note: "Efficient searching algorithm for sorted arrays. Time complexity: O(log n). Works by repeatedly dividing the search interval in half.",
  },
  {
    title: "REST API",
    note: "Representational State Transfer. Uses HTTP methods like GET, POST, PUT, DELETE. Stateless communication between client and server.",
  },
  {
    title: "Git vs GitHub",
    note: "Git is a version control system. GitHub is a cloud-based hosting service for Git repositories.",
  },
  {
    title: "Stack vs Queue",
    note: "Stack follows LIFO (Last In First Out). Queue follows FIFO (First In First Out).",
  },
  {
    title: "SQL Joins",
    note: "JOIN combines rows from two or more tables. Types: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN.",
  },
  {
    title: "Object-Oriented Programming",
    note: "Programming paradigm based on objects. Key concepts: Encapsulation, Inheritance, Polymorphism, Abstraction.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <SearchBarPanel className="mx-auto w-full max-w-xl" />
      <Panel className="flex flex-col gap-10 p-6">
        <PanelTitle>Dashboard</PanelTitle>
        <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {notes.map((note, i) => (
            <article key={note.id} className="h-80">
              <button className="border-brand-light focus-visible:ring-brand flex h-full w-full cursor-pointer flex-col items-start rounded-md border-t-8 p-6 text-left shadow-md transition-transform hover:scale-[0.98] focus:outline-none focus-visible:ring-2 active:scale-[0.96]">
                <h2 className="text-brand text-2xl">{note.title}</h2>
                <p className="text-brand-light mt-4">{note.note}</p>
              </button>
            </article>
          ))}
        </section>
      </Panel>
    </div>
  );
}
