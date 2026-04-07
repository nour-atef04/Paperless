export default function FormInput({
  className,
  placeholder,
  label,
  id,
  name,
  variant = "variant1", // "variant1" | "variant2"
  showLabel = false,
  ...props
}) {
  const variantClass = {
    variant1:
      "bg-surface focus-ring-primary placeholder:text-brand-light rounded-4xl shadow-sm",
    variant2: "border-brand-light/30 rounded-md border bg-transparent p-2",
  };

  return (
    <>
      <label
        htmlFor={id}
        className={`${!showLabel ? "sr-only" : ""} text-sm font-medium`}
      >
        {label}
      </label>
      <input
        name={name}
        id={id}
        className={`${className} ${variantClass[variant]}`}
        placeholder={placeholder}
        {...props}
      />
    </>
  );
}
