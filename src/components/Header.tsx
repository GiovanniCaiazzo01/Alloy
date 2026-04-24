import { RotateCcw, Code, Copy } from "lucide-react";
import type { HeaderProps } from "../types";
import { inputStyle, buttonStyle, primaryButtonStyle } from "../styles/buttons";

export function AppHeader({
  activePreset,
  shell,
  themeName,
  editingName,
  onStartEditingName,
  onStopEditingName,
  onThemeNameChange,
  onReset,
  onOpenExport,
  onPreloadExport,
}: HeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px",
        borderBottom: `1px solid ${shell.colors.border}`,
        background: shell.colors.bg2,
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: shell.colors.brandBg,
            boxShadow: `0 0 12px ${shell.colors.brand}88`,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: shell.colors.fg,
          }}
        >
          Token Studio
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {editingName ? (
          <input
            autoFocus
            value={themeName}
            onChange={(event) => onThemeNameChange(event.target.value)}
            onBlur={onStopEditingName}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onStopEditingName();
              }
            }}
            style={{
              ...inputStyle(shell),
              padding: "4px 10px",
              fontFamily: shell.monoFont,
            }}
          />
        ) : (
          <span
            onClick={onStartEditingName}
            style={{
              fontSize: 11,
              color: shell.colors.fg3,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 5,
              border: "1px dashed transparent",
            }}
            title="Click to rename"
          >
            {themeName}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onReset}
          style={buttonStyle(shell, { disabled: activePreset < 0 })}
          title="Reset to preset"
          disabled={activePreset < 0}
        >
          <RotateCcw size={11} /> Reset
        </button>
        <button
          type="button"
          onClick={onOpenExport}
          onMouseEnter={onPreloadExport}
          onFocus={onPreloadExport}
          style={buttonStyle(shell)}
        >
          <Code size={11} /> Export
        </button>
        <button
          type="button"
          onClick={onOpenExport}
          onMouseEnter={onPreloadExport}
          onFocus={onPreloadExport}
          style={primaryButtonStyle(shell)}
        >
          <Copy size={11} /> Copy CSS
        </button>
      </div>
    </div>
  );
}
