import { useState } from "react";
import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";
import ArrowBadgeDownIcon from "../icons/ArrowBadgeDownIcon";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
  select = false,
  options = [],
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-[var(--color-primary-base)]">
          {label}
        </label>
      )}

      {select ? (
        <div className="relative">
          <select
            id={id}
            {...register}
            {...props}
            className={`w-full px-4 py-2 rounded-lg bg-[var(--color-bg-base)] appearance-none text-[var(--color-primary-base)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] cursor-pointer ${
              error
                ? "border-[var(--color-danger-dark-plus)]"
                : "border-[var(--color-bg-divider)]"
            } border relative`}>
            <option value="" disabled hidden>
              {placeholder || "اختر نوع المستخدم"}
            </option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-bg-muted-text)]">
            <ArrowBadgeDownIcon />
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          {...register}
          {...props}
          className={`w-full px-4 py-2 rounded-lg border-1 bg-[var(--color-bg-base)] text-[var(--color-primary-base)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
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
          {...props}
          className={`w-full px-4 py-2 rounded-lg border-1 border-dashed bg-[var(--color-bg-base)] appearance-none text-[var(--color-primary-base)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
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
            {...props}
            className={`w-full px-4 py-2 rounded-lg border-1 bg-[var(--color-bg-base)] appearance-none text-[var(--color-primary-base)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] ${
              error
                ? "border-[var(--color-danger-dark-plus)]"
                : "border-[var(--color-bg-divider)]"
            }`}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 left-3 flex items-center cursor-pointer text-[var(--color-bg-muted-text)] hover:text-[var(--color-primary-base)] transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
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
