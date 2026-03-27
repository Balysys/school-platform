import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  className?: string;
}

export function Form({ onSubmit, children, className = "" }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-5 animate-fade-in ${className}`}>
      {children}
    </form>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 placeholder-gray-400 ${
          error
            ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
            : "border-gray-200 bg-white hover:border-gray-300 focus:border-primary-500"
        } ${className}`}
      />
      {error && (
        <p className="text-sm font-medium text-danger-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer bg-white ${
          error
            ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
            : "border-gray-200 hover:border-gray-300 focus:border-primary-500"
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="">-- Sélectionner --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm font-medium text-danger-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  isLoading = false,
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
    danger: "bg-danger-600 text-white hover:bg-danger-700 shadow-md hover:shadow-lg",
    success: "bg-success-600 text-white hover:bg-success-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin">⏳</span>
          Traitement...
        </>
      ) : (
        children
      )}
    </button>
  );
}

