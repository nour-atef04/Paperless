export default function Panel({ ariaLabel, children, className }) {
  return (
    <section aria-label={ariaLabel} className={`bg-surface rounded-md shadow-sm ${className || ""} `}>
      {children}
    </section>
  );
}
