import { HEX_INPUT_REGEX } from "../../constants/config";
import type { ColorInputProps } from "../../types";

export function ColorInput({
  label,
  value,
  onChange,
}: ColorInputProps) {
  const handleTextChange = (nextValue: string) => {
      if (HEX_INPUT_REGEX.test(nextValue)) {
        onChange(nextValue);
      }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--ds-color-background-neutral-secondary, #f8f8f8)",
        border: "1px solid var(--ds-color-border-neutral-primary, #e4e4e7)",
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: value,
          flexShrink: 0,
          position: "relative",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <input
          aria-label={label ? `${label} color picker` : "Color picker"}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
            border: "none",
            padding: 0,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 9,
            color: "#888",
            marginBottom: 2,
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <input
          aria-label={label ? `${label} hex value` : "Hex value"}
          value={value}
          onChange={(event) => handleTextChange(event.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--ds-color-text-neutral-secondary, #333)",
            fontFamily: "var(--ds-font-sans)",
            fontSize: 11,
            width: "100%",
            userSelect: "text",
          }}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}