import type { LivePreviewProps } from "../types";
import { PREVIEW_CARDS } from "../constants/config";
import { primaryButtonStyle, secondaryButtonStyle } from "../styles/buttons";

export function LivePreviewPanel({
  shell,
  themeName,
}: LivePreviewProps) {
  return (
    <div
      style={{
        width: 360,
        borderLeft: `1px solid ${shell.colors.border}`,
        overflowY: "auto",
        background: shell.colors.bg2,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${shell.colors.border}`,
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
          }}
        />
        Live Preview
        <span
          style={{
            color: shell.colors.muted,
            marginLeft: "auto",
            fontSize: 8,
            letterSpacing: "0.1em",
          }}
        >
          {themeName}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div
          style={{
            background: shell.colors.bg,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${shell.colors.border}`,
            boxShadow: `0 4px 30px ${shell.isDark ? "#00000066" : "#00000012"}`,
          }}
        >
          <div
            style={{
              background: shell.colors.bg2,
              padding: "10px 14px",
              borderBottom: `1px solid ${shell.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: shell.colors.fg,
                fontSize: 13,
                letterSpacing: "-0.01em",
              }}
            >
              {themeName}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["Docs", "Blog"].map((label) => (
                <span
                  key={label}
                  style={{ fontSize: 9, color: shell.colors.fg3 }}
                >
                  {label}
                </span>
              ))}
              <span
                style={{
                  fontSize: 9,
                  background: shell.colors.brandBg,
                  color: "#fff",
                  padding: "3px 9px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                Get started
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "22px 14px 18px",
              background: `linear-gradient(160deg, ${shell.colors.bg} 0%, ${shell.colors.bg2} 100%)`,
              borderBottom: `1px solid ${shell.colors.border}`,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: shell.colors.brandBg,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              ✦ New release
            </div>
            <div
              style={{
                fontWeight: 700,
                color: shell.colors.fg,
                fontSize: 20,
                lineHeight: 1.15,
                marginBottom: 10,
                letterSpacing: "-0.02em",
              }}
            >
              Design systems
              <br />
              made semantic
            </div>
            <div
              style={{
                fontSize: 11,
                color: shell.colors.fg3,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Primitive scales, semantic aliases, and type utilities in one
              place.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={primaryButtonStyle(shell)}>
                Get Started →
              </button>
              <button type="button" style={secondaryButtonStyle(shell)}>
                Learn more
              </button>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: shell.colors.bg2,
                  border: `1px solid ${shell.colors.border}`,
                  borderRadius: 8,
                  padding: "10px 11px",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    marginBottom: 4,
                    color: shell.colors.brandBg,
                  }}
                >
                  {card.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: shell.colors.fg,
                    marginBottom: 3,
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: 9, color: shell.colors.fg3 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "0 12px 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: shell.colors.bg2,
                border: `1px solid ${shell.colors.border}`,
                borderRadius: 6,
                padding: "7px 10px",
                gap: 6,
              }}
            >
              <span style={{ color: shell.colors.fg3, fontSize: 11 }}>🔍</span>
              <span style={{ fontSize: 10, color: shell.colors.fg3 }}>
                Search tokens...
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "0 12px 12px",
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Primary", bg: shell.colors.brandBg, fg: "#fff" },
              { label: "Success", bg: "#22c55e22", fg: "#22c55e" },
              { label: "Warning", bg: "#f59e0b22", fg: "#f59e0b" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  background: badge.bg,
                  color: badge.fg,
                  fontSize: 8,
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <div
            style={{
              margin: "0 12px 12px",
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 7,
                color: shell.colors.fg3,
                marginBottom: 6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Type Specimen
            </div>
            <div
              style={{
                fontSize: 15,
                color: shell.colors.fg,
                fontWeight: 700,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Display Heading
            </div>
            <div
              style={{
                fontSize: 10,
                color: shell.colors.fg3,
                lineHeight: 1.6,
              }}
            >
              Body text flows naturally with the design token system.
            </div>
          </div>

          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${shell.colors.brandBg}, ${shell.colors.brandBg}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
