export default function FormInput({
  className,
  placeholder,
  ariaLabel,
  ...props
}) {
  return (
    <input
      className={`${className} focus-ring-primary placeholder:text-brand-light rounded-xs focus-visible:ring-offset-8`}
      placeholder={placeholder}
      aria-label={ariaLabel}
      {...props}
    />
  );
}
