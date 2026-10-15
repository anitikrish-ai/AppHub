export default function FormField({
  label,
  name,
  placeholder,
  textarea,
  required,
  type = "text",
  children,
}: {
  label: string;
  name: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
  children?: React.ReactNode;
}) {
  const fieldClass =
    "w-full rounded-md border border-border bg-bg-elevated/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-brand";

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      {children ? (
        children
      ) : textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={fieldClass}
          style={{ borderRadius: "var(--radius-md)" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={fieldClass}
          style={{ borderRadius: "var(--radius-md)" }}
        />
      )}
    </label>
  );
}
