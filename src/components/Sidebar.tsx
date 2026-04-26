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
      className="flex md:flex-col overflow-x-auto md:overflow-y-auto w-full md:w-[210px] flex-shrink-0 p-2 md:p-3 no-scrollbar"
      style={{
        borderRight: `1px solid ${shell.colors.border}`,
        borderBottom: `1px solid ${shell.colors.border}`,
        background: shell.colors.bg2,
      }}
    >
      <div
        className="hidden md:block text-[8px] tracking-[0.2em] uppercase font-bold mb-2 mt-1 px-1.5"
        style={{ color: shell.colors.muted }}
      >
        Presets
      </div>
      <div className="flex md:flex-col gap-1.5 md:gap-0">
        {PRESETS.map((preset, index) => {
          const isActive = activePreset === index;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(index)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[11px] text-left transition-all whitespace-nowrap flex-shrink-0 md:flex-shrink md:w-full md:mb-1 cursor-pointer border"
              style={{
                borderColor: isActive ? shell.colors.border2 : "transparent",
                background: isActive ? shell.colors.bg3 : "transparent",
              }}
            >
              <div className="flex gap-0.5 flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-[1px]"
                  style={{
                    background: preset.primitives.primary?.[500] ?? "#ccc",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-[1px]"
                  style={{
                    background: preset.primitives.grey?.[900] ?? "#333",
                  }}
                />
              </div>
              <span
                className="flex-1 overflow-hidden text-ellipsis"
                style={{
                  color: isActive ? shell.colors.fg : shell.colors.fg3,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {preset.name}
              </span>
              {isActive && (
                <ChevronRight
                  size={10}
                  className="hidden md:block"
                  style={{ color: shell.colors.muted }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className="hidden md:block text-[8px] tracking-[0.2em] uppercase font-bold mb-2 mt-4 px-1.5"
        style={{ color: shell.colors.muted }}
      >
        Custom
      </div>
      <button
        type="button"
        onClick={onCreateBlankCanvas}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-[11px] text-left transition-all whitespace-nowrap flex-shrink-0 md:flex-shrink md:w-full cursor-pointer border border-dashed ml-1.5 md:ml-0"
        style={{
          borderColor: shell.colors.border,
          background: "transparent",
        }}
      >
        <Sparkles size={12} style={{ color: shell.colors.brandBg }} />
        <span style={{ color: shell.colors.fg3 }}>Blank Canvas</span>
      </button>
    </div>
  );
}