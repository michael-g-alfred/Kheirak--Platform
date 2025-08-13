function BooleanButton({
  onClick,
  isActive,
  labelActive,
  labelInactive,
  ActiveIcon,
  InactiveIcon,
  className = "",
  variant = "basic",
}) {
  let borderColor,
    textColor,
    hoverBg,
    hoverText,
    activeBg,
    activeText,
    inactiveText;
  if (variant === "danger") {
    borderColor = "var(--color-danger-base)";
    textColor = "var(--color-danger-base)";
    hoverBg = "var(--color-danger-dark)";
    hoverText = "var(--color-bg-text)";
    activeBg = "var(--color-danger-base)";
    activeText = "var(--color-bg-text)";
    inactiveText = "var(--color-danger-base)";
  } else if (variant === "success") {
    borderColor = "var(--color-success-base)";
    textColor = "var(--color-success-base)";
    hoverBg = "var(--color-success-hover)";
    hoverText = "var(--color-bg-text)";
    activeBg = "var(--color-success-base)";
    activeText = "var(--color-bg-text)";
    inactiveText = "var(--color-success-base)";
  } else {
    borderColor = "var(--color-primary-base)";
    textColor = "var(--color-primary-base)";
    hoverBg = "var(--color-primary-hover)";
    hoverText = "var(--color-bg-text)";
    activeBg = "var(--color-primary-base)";
    activeText = "var(--color-bg-text)";
    inactiveText = "var(--color-primary-base)";
  }
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={isActive ? labelActive : labelInactive}
      className={`px-6 py-2 border rounded transition
        border-[${borderColor}]
        hover:bg-[${hoverBg}]
        hover:text-[${hoverText}]
        ${
          isActive
            ? `bg-[${activeBg}] text-[${activeText}]`
            : `text-[${inactiveText}]`
        }
        ${className}`.replace(/\s+/g, " ")}>
      {isActive ? <ActiveIcon /> : <InactiveIcon />}
    </button>
  );
}

export default BooleanButton;
