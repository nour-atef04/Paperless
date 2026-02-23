export default function FormInput({
  className,
  placeholder,
  label,
  id,
  name,
  ...props
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        name={name}
        id={id}
        className={`${className} bg-surface focus-ring-primary placeholder:text-brand-light rounded-4xl shadow-sm`}
        placeholder={placeholder}
        {...props}
      />
    </>
  );
}
