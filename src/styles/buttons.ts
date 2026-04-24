import type { CSSProperties } from "react";
import type { ShellTheme } from "../types";

export function inputStyle(shell: ShellTheme): CSSProperties {
  return {
    background: shell.colors.bg,
    border: `1px solid ${shell.colors.border2}`,
    borderRadius: 5,
    padding: "6px 8px",
    fontSize: 11,
    color: shell.colors.fg,
    fontFamily: shell.monoFont,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
}

export function buttonStyle(
  shell: ShellTheme,
  options?: { disabled?: boolean }
): CSSProperties {
  const isDisabled = options?.disabled ?? false;

  return {
    padding: "6px 13px",
    borderRadius: 6,
    border: `1px solid ${shell.colors.border}`,
    background: "transparent",
    color: isDisabled ? shell.colors.muted : shell.colors.fg2,
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: shell.fontFamily,
    letterSpacing: "0.04em",
    transition: "all .2s",
    opacity: isDisabled ? 0.55 : 1,
  };
}

export function secondaryButtonStyle(shell: ShellTheme): CSSProperties {
  return {
    ...buttonStyle(shell),
    background: "transparent",
  };
}

export function primaryButtonStyle(shell: ShellTheme): CSSProperties {
  return {
    ...buttonStyle(shell),
    background: shell.colors.brandBg,
    border: `1px solid ${shell.colors.brand}`,
    color: "#fff",
    fontWeight: 600,
  };
}