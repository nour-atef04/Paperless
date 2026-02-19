export default function Panel({
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  as: Component = "section",
  ...props
}) {
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
