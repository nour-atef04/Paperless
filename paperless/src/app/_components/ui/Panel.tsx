type PanelProps = React.HTMLAttributes<HTMLElement> & {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  dark?: boolean;
  rounded?: boolean;
};

export default function Panel({
  ariaLabel,
  ariaLabelledBy,
  children,
  className = "",
  as: Component = "section",
  dark = false,
  rounded = true,
  ...props
}: PanelProps) {
  return (
    <Component
      {...props}
      className={`${dark ? "bg-brand-dark" : "bg-surface"} ${rounded ? "rounded-md" : ""} shadow-sm ${className || ""} `}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}
