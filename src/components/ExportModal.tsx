import { useState, useEffect, useRef } from "react";
import { X, Check, Copy } from "lucide-react";
import type { ExportModalProps } from "../types";
import { generateExport } from "../utils/export";

export function ExportModal({
  theme,
  onClose,
  shell,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const code = generateExport(theme);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[200] backdrop-blur-md p-5"
      onClick={onClose}
    >
      <div
        className="rounded-2xl border w-full max-w-[720px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
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
            Export · {theme.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded"
            style={{ color: shell.colors.muted }}
            aria-label="Close export modal"
          >
            <X size={16} />
          </button>
        </div>
        <pre
          className="p-5 overflow-y-auto flex-1 m-0 text-[11px] leading-[1.8] whitespace-pre"
          style={{
            color: shell.colors.fg2,
            background: shell.colors.bg2,
            fontFamily: shell.monoFont,
          }}
        >
          {code}
        </pre>
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
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all"
            style={{
              background: shell.colors.brandBg,
              color: shell.colors.brandText,
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </div>
  );
}