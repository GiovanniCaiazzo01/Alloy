import { useState, useEffect, useRef } from "react";
import { X, Check, Copy } from "lucide-react";
import type { ExportModalProps } from "../types";
import { generateExport } from "../utils/export";
import { primaryButtonStyle, secondaryButtonStyle } from "../styles/buttons";

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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: shell.colors.bg,
          border: `1px solid ${shell.colors.border}`,
          borderRadius: 14,
          width: 720,
          maxWidth: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 24px 80px ${shell.isDark ? "#000000aa" : "#00000033"}`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${shell.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: shell.colors.fg,
              letterSpacing: "0.03em",
            }}
          >
            Export · {theme.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: shell.colors.muted,
              padding: 4,
            }}
            aria-label="Close export modal"
          >
            <X size={16} />
          </button>
        </div>
        <pre
          style={{
            padding: 20,
            overflowY: "auto",
            flex: 1,
            margin: 0,
            fontSize: 11,
            lineHeight: 1.8,
            color: shell.colors.fg2,
            background: shell.colors.bg2,
            fontFamily: shell.monoFont,
            whiteSpace: "pre",
          }}
        >
          {code}
        </pre>
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${shell.colors.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={secondaryButtonStyle(shell)}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            style={primaryButtonStyle(shell)}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </div>
  );
}