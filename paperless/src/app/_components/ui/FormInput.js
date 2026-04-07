export default function FormInput({
  className = "",
  placeholder,
  label,
  id,
  name,
  variant = "variant1", // "variant1" | "variant2"
  showLabel = false,
  selectInput = false,
  selectOptions,
  ...props
}) {
  const variantClass = {
    variant1:
      "bg-surface focus-ring-primary placeholder:text-brand-light rounded-4xl shadow-sm",
    variant2: "border-brand-light/30 rounded-md border bg-transparent p-2",
  };

  const sharedClasses = `${variantClass[variant]} ${className} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50 w-full`;

  return (
    <>
      <label
        htmlFor={id}
        className={`${!showLabel ? "sr-only" : ""} text-sm font-medium`}
      >
        {label}
      </label>
      {selectInput ? (
        <select
          defaultValue={props.defaultValue || ""}
          name={name}
          id={id}
          className={sharedClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {selectOptions.map((option, index) => (
            <option key={index} value={option.id || option.value || option}>
              {option.id || option.value || option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          id={id}
          className={`${variantClass[variant]} ${className} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50`}
          placeholder={placeholder}
          {...props}
        />
      )}
    </>
  );
}
