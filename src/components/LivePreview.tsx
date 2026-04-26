import type { LivePreviewProps } from "../types";
import { PREVIEW_CARDS } from "../constants/config";

const PREVIEW_NAV_ITEMS = ["Docs", "Blog"] as const;
const STATIC_PREVIEW_BADGES = [
  { label: "Success", bg: "#22c55e22", fg: "#22c55e" },
  { label: "Warning", bg: "#f59e0b22", fg: "#f59e0b" },
] as const;

export function LivePreviewPanel({
  shell,
  themeName,
}: LivePreviewProps) {
  return (
    <div
      className="w-full h-[250px] md:h-[320px] overflow-y-auto flex-shrink-0 border-t transition-all"
      style={{
        borderColor: shell.colors.border,
        background: shell.colors.bg2,
      }}
    >
      <div
        className="px-4 py-3 border-b text-[8px] tracking-[0.2em] uppercase font-bold flex items-center gap-2"
        style={{
          borderColor: shell.colors.border,
          color: shell.colors.muted,
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"
        />
        Live Preview
        <span
          className="ml-auto text-[8px] tracking-widest opacity-60"
          style={{ color: shell.colors.muted }}
        >
          {themeName}
        </span>
      </div>
      <div className="p-3.5">
        <div
          className="rounded-xl overflow-hidden border shadow-lg transition-shadow"
          style={{
            background: shell.colors.bg,
            borderColor: shell.colors.border,
          }}
        >
          <div
            className="px-3.5 py-2.5 border-b flex items-center justify-between"
            style={{
              background: shell.colors.bg2,
              borderColor: shell.colors.border,
            }}
          >
            <span
              className="font-bold text-[13px] tracking-tight"
              style={{ color: shell.colors.fg }}
            >
              {themeName}
            </span>
            <div className="flex gap-2.5 items-center">
              {PREVIEW_NAV_ITEMS.map((label) => (
                <span
                  key={label}
                  className="text-[9px]"
                  style={{ color: shell.colors.fg3 }}
                >
                  {label}
                </span>
              ))}
              <span
                className="text-[9px] px-2 py-0.5 rounded font-bold"
                style={{
                  background: shell.colors.brandBg,
                  color: "#fff",
                }}
              >
                Get started
              </span>
            </div>
          </div>

          <div
            className="px-3.5 py-5 border-b"
            style={{
              background: `linear-gradient(160deg, ${shell.colors.bg} 0%, ${shell.colors.bg2} 100%)`,
              borderColor: shell.colors.border,
            }}
          >
            <div
              className="text-[8px] uppercase font-bold tracking-widest mb-2"
              style={{ color: shell.colors.brandBg }}
            >
              ✦ New release
            </div>
            <div
              className="font-bold text-xl leading-none mb-2.5 tracking-tight"
              style={{ color: shell.colors.fg }}
            >
              Design systems
              <br />
              made semantic
            </div>
            <div
              className="text-[11px] leading-relaxed mb-3.5"
              style={{ color: shell.colors.fg3 }}
            >
              Primitive scales, semantic aliases, and type utilities in one place.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all"
                style={{
                  background: shell.colors.brandBg,
                  color: "#fff",
                }}
              >
                Get Started →
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all border"
                style={{
                  borderColor: shell.colors.border,
                  background: "transparent",
                  color: shell.colors.fg2,
                }}
              >
                Learn more
              </button>
            </div>
          </div>

          <div className="p-3 grid grid-cols-2 gap-2">
            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border p-2.5 transition-colors"
                style={{
                  background: shell.colors.bg2,
                  borderColor: shell.colors.border,
                }}
              >
                <div
                  className="text-lg mb-1"
                  style={{ color: shell.colors.brandBg }}
                >
                  {card.icon}
                </div>
                <div
                  className="text-[11px] font-bold mb-0.5"
                  style={{ color: shell.colors.fg }}
                >
                  {card.title}
                </div>
                <div className="text-[9px]" style={{ color: shell.colors.fg3 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-2.5">
            <div
              className="flex items-center rounded-md border px-2.5 py-1.5 gap-1.5"
              style={{
                background: shell.colors.bg2,
                borderColor: shell.colors.border,
              }}
            >
              <span className="text-xs grayscale opacity-50">🔍</span>
              <span className="text-[10px]" style={{ color: shell.colors.fg3 }}>
                Search tokens...
              </span>
            </div>
          </div>

          <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
            {[
              { label: "Primary", bg: shell.colors.brandBg, fg: "#fff" },
              ...STATIC_PREVIEW_BADGES,
            ].map((badge) => (
              <span
                key={badge.label}
                className="text-[8px] px-2 py-0.5 rounded font-bold tracking-wider"
                style={{
                  background: badge.bg,
                  color: badge.fg,
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <div
            className="mx-3 mb-3 rounded-lg border p-3"
            style={{
              background: shell.colors.bg2,
              borderColor: shell.colors.border,
            }}
          >
            <div
              className="text-[7px] uppercase font-bold mb-1.5 tracking-widest"
              style={{ color: shell.colors.fg3 }}
            >
              Type Specimen
            </div>
            <div
              className="text-[15px] font-bold mb-1 tracking-tight"
              style={{ color: shell.colors.fg }}
            >
              Display Heading
            </div>
            <div
              className="text-[10px] leading-relaxed"
              style={{ color: shell.colors.fg3 }}
            >
              Body text flows naturally with the design token system.
            </div>
          </div>

          <div
            className="h-1"
            style={{
              background: `linear-gradient(90deg, ${shell.colors.brandBg}, ${shell.colors.brandBg}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
