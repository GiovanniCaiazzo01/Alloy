import { PanelsTopLeft, RotateCcw, Code, Copy, Upload } from "lucide-react";
import type { HeaderProps } from "../types";

export function AppHeader({
  activePreset,
  shell,
  themeName,
  editingName,
  previewOpen,
  onStartEditingName,
  onStopEditingName,
  onThemeNameChange,
  onReset,
  onOpenImport,
  onOpenExport,
  onTogglePreview,
  onPreloadImport,
  onPreloadExport,
}: HeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 z-10 sticky top-0"
      style={{
        borderColor: shell.colors.border,
        background: shell.colors.bg2,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: shell.colors.brandBg,
            boxShadow: `0 0 12px ${shell.colors.brand}88`,
          }}
        />
        <span
          className="hidden sm:inline-block text-[13px] font-extrabold tracking-widest uppercase"
          style={{ color: shell.colors.fg }}
        >
          Token Studio
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-1 justify-center px-4">
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
            className="px-2 py-1 text-[11px] outline-none rounded bg-transparent border max-w-[120px] sm:max-w-none"
            style={{
              borderColor: shell.colors.border,
              color: shell.colors.fg,
              fontFamily: shell.monoFont,
            }}
          />
        ) : (
          <span
            onClick={onStartEditingName}
            className="text-[11px] cursor-pointer px-2 py-1 rounded truncate max-w-[120px] sm:max-w-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ color: shell.colors.fg3 }}
            title="Click to rename"
          >
            {themeName}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border"
          style={{
            borderColor: shell.colors.border,
            background: shell.colors.bg,
            color: shell.colors.fg,
          }}
          title="Reset to preset"
          disabled={activePreset < 0}
        >
          <RotateCcw size={11} /> <span className="hidden md:inline">Reset</span>
        </button>
        <button
          type="button"
          onClick={onTogglePreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border"
          style={{
            borderColor: shell.colors.border,
            background: previewOpen ? shell.colors.bg3 : shell.colors.bg,
            color: shell.colors.fg,
          }}
        >
          <PanelsTopLeft size={11} />
          <span className="hidden md:inline">{previewOpen ? "Hide Preview" : "Show Preview"}</span>
        </button>
        <button
          type="button"
          onClick={onOpenImport}
          onMouseEnter={onPreloadImport}
          onFocus={onPreloadImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border"
          style={{
            borderColor: shell.colors.border,
            background: shell.colors.bg,
            color: shell.colors.fg,
          }}
        >
          <Upload size={11} /> <span className="hidden sm:inline">Import</span>
        </button>
        <button
          type="button"
          onClick={onOpenExport}
          onMouseEnter={onPreloadExport}
          onFocus={onPreloadExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border"
          style={{
            borderColor: shell.colors.border,
            background: shell.colors.bg,
            color: shell.colors.fg,
          }}
        >
          <Code size={11} /> <span className="hidden sm:inline">Export</span>
        </button>
        <button
          type="button"
          onClick={onOpenExport}
          onMouseEnter={onPreloadExport}
          onFocus={onPreloadExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer"
          style={{
            background: shell.colors.brandBg,
            color: shell.colors.brandText,
          }}
        >
          <Copy size={11} /> <span className="hidden md:inline">Copy CSS</span>
        </button>
      </div>
    </div>
  );
}
