type PanelProps = React.HTMLAttributes<HTMLElement> & {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export default function Panel({
  ariaLabel,
  ariaLabelledBy,
  children,
  className = "",
  as: Component = "section",
  ...props
}: PanelProps) {
  return (
    <Component
      {...props}
      className={`bg-surface rounded-md shadow-sm ${className || ""} `}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}
