type PanelProps = React.HTMLAttributes<HTMLElement> & {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  dark?: boolean;
};

export default function Panel({
  ariaLabel,
  ariaLabelledBy,
  children,
  className = "",
  as: Component = "section",
  dark = false,
  ...props
}: PanelProps) {
  return (
    <Component
      {...props}
      className={`${dark ? "bg-brand-darkest" : "bg-surface"} rounded-md shadow-sm ${className || ""} `}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}
