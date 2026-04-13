type FormInputProps = React.ComponentPropsWithoutRef<"input"> & {
  className?: string;
  label?: string;
  variant?: "variant1" | "variant2";
  showLabel?: boolean;
  selectInput?: boolean;
  selectOptions?: { id: string | number; name: string }[];
};

export default function FormInput({
  className = "",
  placeholder,
  label,
  id,
  name,
  variant = "variant1", // "variant1" | "variant2"
  showLabel = false,
  selectInput = false,
  selectOptions = [],
  value,
  defaultValue,
  ...props
}: FormInputProps) {
  const variantClass = {
    variant1:
      "bg-surface focus-ring-primary placeholder:text-brand-light rounded-4xl shadow-sm",
    variant2: "border-brand-light/30 rounded-md border bg-transparent p-2",
  };

  const sharedClasses = `${variantClass[variant]} ${className} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50 w-full`;

  // determining if the parent component is controlling this input
  const isControlled = value !== undefined;

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
          name={name}
          id={id}
          className={sharedClasses}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue || "" : undefined}
          // to bypass clash between HTMLInputElement and HTMLSelectElement typings
          {...(props as any)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {selectOptions.map((option, index) => (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          id={id}
          className={sharedClasses}
          placeholder={placeholder}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          {...props}
        />
      )}
    </>
  );
}
