import React, { useState } from "react";
import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
  select = false,
  options = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-2 text-[var(--color-bg-text)]">
          {label}
        </label>
      )}

      {select ? (
        <select
          id={id}
          {...register}
          className={`w-full px-4 py-2 rounded-lg border-1 bg-transparent text-[var(--color-bg-text)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
            error
              ? "border-[var(--color-danger-dark-plus)]"
              : "border-[var(--color-bg-divider)]"
          }`}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-2 rounded-lg border-1 bg-transparent text-[var(--color-bg-text)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
            error
              ? "border-[var(--color-danger-dark-plus)]"
              : "border-[var(--color-bg-divider)]"
          }`}
        />
      ) : type === "file" ? (
        <input
          id={id}
          type="file"
          {...register}
          className={`w-full px-4 py-2 rounded-lg border-2 border-dashed text-[var(--color-bg-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
            error
              ? "border-[var(--color-danger-dark-plus)]"
              : "border-[var(--color-bg-divider)]"
          }`}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            {...register}
            className={`w-full px-4 py-2 rounded-lg border-1 bg-transparent text-[var(--color-bg-text)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
              error
                ? "border-[var(--color-danger-dark-plus)]"
                : "border-[var(--color-bg-divider)]"
            }`}
          />
          {isPassword && (
            <div
              className="absolute inset-y-0 left-3 flex items-center cursor-pointer text-[var(--color-bg-muted-text)]"
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="bg-[var(--color-danger-dark-plus)] text-[var(--color-danger-light)] mt-1 text-sm rounded px-1 py-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
