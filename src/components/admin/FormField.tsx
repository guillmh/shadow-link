import { UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  label: string;
  type?: "text" | "url" | "email" | "password";
  registro: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
};

export default function FormField({
  label,
  type = "text",
  registro,
  error,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...registro}
        className="w-full font-body text-sm px-3 py-2 bg-surface border border-hairline text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
      />
      {error && <p className="font-mono text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
