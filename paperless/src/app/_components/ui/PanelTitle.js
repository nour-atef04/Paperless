export default function PanelTitle({
  children,
  id,
  level = 1,
  className = "",
}) {
  const Tag = `h${level}`; // dynamically render h1, h2, h3, ...
  return (
    <Tag className={`text-brand text-3xl font-bold ${className}`}>
      {children}
    </Tag>
  );
}
