import { ChevronRight, FileUp, Sparkles } from "lucide-react";
import type { PresetSidebarProps } from "../types";
import { PRESETS } from "../constants/presets";

export function PresetSidebar({
  activePreset,
  shell,
  themeName,
  importedThemeState,
  onSelectPreset,
  onCreateBlankCanvas,
}: PresetSidebarProps) {
  const presetThemes = PRESETS.filter((preset) => preset.id !== "custom");
  const activeImportedTheme = activePreset < 0 ? importedThemeState : null;
  const isImportedThemeActive = activeImportedTheme !== null;
  const isBlankCanvasActive = activePreset < 0 && importedThemeState === null;
  const importStats = activeImportedTheme
    ? [
        { label: "Scales", value: activeImportedTheme.summary.primitiveScales },
        { label: "Colors", value: activeImportedTheme.summary.primitiveTokens },
        { label: "Aliases", value: activeImportedTheme.summary.semantics },
        { label: "Type", value: activeImportedTheme.summary.typography },
        { label: "Breaks", value: activeImportedTheme.summary.breakpoints },
      ].filter((stat) => stat.value > 0)
    : [];

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
        {presetThemes.map((preset, index) => {
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
      <div className="flex md:flex-col gap-1.5 ml-1.5 md:ml-0">
        {isImportedThemeActive ? (
          <div
            className="relative overflow-hidden rounded-xl border px-3 py-3 min-w-[220px] md:min-w-0 md:w-full flex-shrink-0"
            style={{
              borderColor: shell.colors.border2,
              background: `linear-gradient(160deg, ${shell.colors.bg3} 0%, ${shell.colors.bg2} 100%)`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, ${shell.colors.brandBg}, transparent)`,
              }}
            />
            <div className="relative flex items-start gap-2.5">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-lg border shrink-0"
                style={{
                  borderColor: shell.colors.border,
                  background: `${shell.colors.brandBg}1a`,
                  color: shell.colors.brandBg,
                }}
              >
                <FileUp size={12} />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-[8px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: shell.colors.brandBg }}
                >
                  Imported
                </div>
                <div
                  className="mt-1 text-[12px] font-semibold truncate"
                  style={{ color: shell.colors.fg }}
                >
                  {themeName}
                </div>
                <div
                  className="mt-1 text-[9px] truncate"
                  style={{
                    color: shell.colors.fg3,
                    fontFamily: shell.monoFont,
                  }}
                  title={activeImportedTheme.sourceLabel}
                >
                  {activeImportedTheme.sourceLabel}
                </div>
              </div>
            </div>

            {importStats.length ? (
              <div className="relative mt-3 grid grid-cols-2 gap-1.5">
                {importStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border px-2 py-1.5"
                    style={{
                      borderColor: shell.colors.border,
                      background: `${shell.colors.bg}cc`,
                    }}
                  >
                    <div
                      className="text-[7px] uppercase tracking-[0.18em]"
                      style={{ color: shell.colors.muted }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className="mt-0.5 text-[11px] font-semibold"
                      style={{ color: shell.colors.fg }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onCreateBlankCanvas}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-[11px] text-left transition-all whitespace-nowrap flex-shrink-0 md:flex-shrink md:w-full cursor-pointer border border-dashed"
          style={{
            borderColor: isBlankCanvasActive ? shell.colors.border2 : shell.colors.border,
            background: isBlankCanvasActive ? shell.colors.bg3 : "transparent",
          }}
        >
          <Sparkles size={12} style={{ color: shell.colors.brandBg }} />
          <span
            style={{
              color: isBlankCanvasActive ? shell.colors.fg : shell.colors.fg3,
              fontWeight: isBlankCanvasActive ? 600 : 400,
            }}
          >
            Blank Canvas
          </span>
        </button>
      </div>
    </div>
  );
}
