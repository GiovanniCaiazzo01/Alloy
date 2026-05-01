import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Upload, X } from "lucide-react";
import type { ImportModalProps } from "../types";

export function ImportModal({
  shell,
  onClose,
  onImport,
}: ImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    const trimmedPayload = payload.trim();
    if (!trimmedPayload) {
      setError("Paste a token JSON payload or load a JSON file first.");
      return;
    }

    try {
      onImport(trimmedPayload);
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "The token payload could not be imported."
      );
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const fileContents = await file.text();
      setPayload(fileContents);
      setError("");
    } catch {
      setError("The selected file could not be read.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[200] backdrop-blur-md p-5"
      onClick={onClose}
    >
      <div
        className="rounded-2xl border w-full max-w-[760px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          background: shell.colors.bg,
          borderColor: shell.colors.border,
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: shell.colors.border }}
        >
          <span
            className="text-[13px] font-bold tracking-tight"
            style={{ color: shell.colors.fg }}
          >
            Import Tokens
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded"
            style={{ color: shell.colors.muted }}
            aria-label="Close import modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p
            className="text-[11px] leading-relaxed m-0"
            style={{ color: shell.colors.fg3 }}
          >
            Paste a Figma Tokens or DTCG JSON payload. Primitive scales, semantic
            colors, typography, and breakpoints are imported when present.
          </p>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium border cursor-pointer transition-all"
              style={{
                borderColor: shell.colors.border,
                background: shell.colors.bg,
                color: shell.colors.fg,
              }}
            >
              <FileUp size={12} /> Load JSON File
            </button>
          </div>

          <textarea
            value={payload}
            onChange={(event) => {
              setPayload(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder={`{
  "primary": {
    "500": { "$type": "color", "$value": "#ffc404" }
  }
}`}
            className="w-full min-h-[320px] rounded-xl border outline-none resize-y p-4 text-[11px] leading-[1.7]"
            style={{
              borderColor: shell.colors.border,
              background: shell.colors.bg2,
              color: shell.colors.fg2,
              fontFamily: shell.monoFont,
            }}
            spellCheck={false}
          />

          {error ? (
            <div
              className="rounded-lg border px-3 py-2 text-[11px]"
              style={{
                borderColor: "#ef4444",
                background: `${shell.colors.bg2}`,
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div
          className="px-5 py-3 border-t flex gap-2 justify-end shrink-0"
          style={{ borderColor: shell.colors.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-[11px] font-medium border cursor-pointer transition-all"
            style={{
              borderColor: shell.colors.border,
              background: shell.colors.bg,
              color: shell.colors.fg,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all"
            style={{
              background: shell.colors.brandBg,
              color: shell.colors.brandText,
            }}
          >
            <Upload size={12} /> Import Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
