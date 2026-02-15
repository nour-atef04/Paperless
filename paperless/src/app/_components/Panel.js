export default function Panel({ children, className }) {
  return (
    <section className={`bg-surface rounded-md shadow-sm ${className || ""} `}>
      {children}
    </section>
  );
}
