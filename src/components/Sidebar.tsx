import { ChevronRight, Sparkles } from "lucide-react";
import type { PresetSidebarProps } from "../types";
import { PRESETS } from "../constants/presets";

export function PresetSidebar({
  activePreset,
  shell,
  onSelectPreset,
  onCreateBlankCanvas,
}: PresetSidebarProps) {
  return (
    <div
      style={{
        width: 210,
        borderRight: `1px solid ${shell.colors.border}`,
        overflowY: "auto",
        padding: "12px 10px",
        background: shell.colors.bg2,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          marginBottom: 8,
          marginTop: 4,
          padding: "0 6px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Presets
      </div>
      {PRESETS.map((preset, index) => {
        const isActive = activePreset === index;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(index)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 7,
              cursor: "pointer",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all .15s",
              border: `1px solid ${
                isActive ? shell.colors.border2 : "transparent"
              }`,
              background: isActive ? shell.colors.bg3 : "transparent",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.primary?.[500] ?? "#ccc",
                }}
              />
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.grey?.[900] ?? "#333",
                }}
              />
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.grey?.[100] ?? "#fff",
                  border: `1px solid ${shell.colors.border}`,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: isActive ? shell.colors.fg : shell.colors.fg3,
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {preset.name}
            </span>
            {isActive ? (
              <ChevronRight size={10} color={shell.colors.muted} />
            ) : null}
          </button>
        );
      })}

      <div
        style={{
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          marginBottom: 8,
          marginTop: 18,
          padding: "0 6px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Custom
      </div>
      <button
        type="button"
        onClick={onCreateBlankCanvas}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 7,
          cursor: "pointer",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px dashed ${shell.colors.border}`,
          background: "transparent",
          textAlign: "left",
        }}
      >
        <Sparkles size={12} color={shell.colors.brandBg} />
        <span style={{ fontSize: 11, color: shell.colors.fg3 }}>
          Blank Canvas
        </span>
      </button>
    </div>
  );
}