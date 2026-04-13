type PanelTitleProps = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export default function PanelTitle({
  children,
  level = 1,
  className = "",
}: PanelTitleProps) {
  const Tag = `h${level}` as React.ElementType; // dynamically render h1, h2, h3, ...

  return (
    <Tag className={`text-brand text-4xl font-bold ${className}`}>
      {children}
    </Tag>
  );
}
