import type { ThemeEditorProps } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { inputStyle } from "../styles/buttons";

export function TypographyTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  return (
    <div>
      <SectionTitle shell={shell}>Font Family</SectionTitle>
      <div style={{ marginBottom: 20 }}>
        <input
          value={theme.fontFamily}
          onChange={(event) =>
            dispatch({
              type: "set-font-family",
              fontFamily: event.target.value,
            })
          }
          style={{
            ...inputStyle(shell),
            width: "100%",
            fontFamily: shell.fontFamily,
          }}
        />
        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            background: shell.colors.bg2,
            border: `1px solid ${shell.colors.border}`,
            borderRadius: 6,
            fontFamily: `'${theme.fontFamily}', sans-serif`,
            fontSize: 16,
            color: shell.colors.fg,
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>

      <SectionTitle shell={shell}>Type Scale</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(theme.typography).map(([tokenName, token]) => (
          <div
            key={tokenName}
            style={{
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: shell.colors.fg,
                  width: 100,
                }}
              >
                {tokenName}
              </span>
              <span style={{ fontSize: 10, color: shell.colors.muted }}>
                {token.size} / {token.lineHeight} / {token.weight}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 80px",
                gap: 8,
              }}
            >
              <input
                placeholder="Size"
                value={token.size}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { size: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                placeholder="Line-height"
                value={token.lineHeight}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { lineHeight: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                placeholder="Letter-spacing"
                value={token.letterSpacing}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { letterSpacing: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                type="number"
                placeholder="Weight"
                value={token.weight}
                onChange={(event) => {
                  const nextWeight = Number(event.target.value);
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: {
                      weight: Number.isNaN(nextWeight)
                        ? token.weight
                        : nextWeight,
                    },
                  });
                }}
                style={inputStyle(shell)}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: `'${theme.fontFamily}', sans-serif`,
                fontSize: token.size,
                lineHeight: token.lineHeight,
                letterSpacing: token.letterSpacing,
                fontWeight: token.weight,
                color: shell.colors.fg,
              }}
            >
              {tokenName.startsWith("h")
                ? "Display Heading Sample"
                : "Body text flows with rhythm and intent."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}