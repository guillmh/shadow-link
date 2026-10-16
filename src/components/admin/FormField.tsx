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
  const id = registro.name;
  const idError = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="label-mono block mb-1">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        {...registro}
        className={`field${error ? " is-error" : ""}`}
      />
      {error && (
        <p id={idError} className="font-mono text-[11px] text-danger mt-1.5">{error}</p>
      )}
    </div>
  );
}
