import type { ThemeEditorProps } from "../types";
import { SectionTitle } from "./ui/SectionTitle";

export function TypographyTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  return (
    <div>
      <SectionTitle shell={shell}>Font Family</SectionTitle>
      <div className="mb-5 flex flex-col gap-2">
        <input
          value={theme.fontFamily}
          onChange={(event) =>
            dispatch({
              type: "set-font-family",
              fontFamily: event.target.value,
            })
          }
          className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
          style={{
            background: shell.colors.bg,
            borderColor: shell.colors.border,
            color: shell.colors.fg,
            fontFamily: shell.fontFamily,
          }}
        />
        <div
          className="p-3 rounded-md border text-base"
          style={{
            background: shell.colors.bg2,
            borderColor: shell.colors.border,
            fontFamily: `'${theme.fontFamily}', sans-serif`,
            color: shell.colors.fg,
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>

      <SectionTitle shell={shell}>Type Scale</SectionTitle>
      <div className="flex flex-col gap-2.5">
        {Object.entries(theme.typography).map(([tokenName, token]) => (
          <div
            key={tokenName}
            className="p-3 rounded-lg border"
            style={{
              background: shell.colors.bg2,
              borderColor: shell.colors.border,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wider w-[100px] truncate"
                style={{ color: shell.colors.fg }}
              >
                {tokenName}
              </span>
              <span className="text-[10px] opacity-50 font-mono">
                {token.size} / {token.lineHeight} / {token.weight}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-1">
                <div className="text-[8px] uppercase font-bold opacity-40 px-1">Size</div>
                <input
                  value={token.size}
                  onChange={(event) =>
                    dispatch({
                      type: "update-typography",
                      key: tokenName,
                      changes: { size: event.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded border outline-none text-[10px]"
                  style={{
                    background: shell.colors.bg,
                    borderColor: shell.colors.border,
                    color: shell.colors.fg,
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[8px] uppercase font-bold opacity-40 px-1">Line</div>
                <input
                  value={token.lineHeight}
                  onChange={(event) =>
                    dispatch({
                      type: "update-typography",
                      key: tokenName,
                      changes: { lineHeight: event.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded border outline-none text-[10px]"
                  style={{
                    background: shell.colors.bg,
                    borderColor: shell.colors.border,
                    color: shell.colors.fg,
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[8px] uppercase font-bold opacity-40 px-1">Track</div>
                <input
                  value={token.letterSpacing}
                  onChange={(event) =>
                    dispatch({
                      type: "update-typography",
                      key: tokenName,
                      changes: { letterSpacing: event.target.value },
                    })
                  }
                  className="w-full px-2 py-1 rounded border outline-none text-[10px]"
                  style={{
                    background: shell.colors.bg,
                    borderColor: shell.colors.border,
                    color: shell.colors.fg,
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[8px] uppercase font-bold opacity-40 px-1">Weight</div>
                <input
                  type="number"
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
                  className="w-full px-2 py-1 rounded border outline-none text-[10px]"
                  style={{
                    background: shell.colors.bg,
                    borderColor: shell.colors.border,
                    color: shell.colors.fg,
                  }}
                />
              </div>
            </div>
            <div
              className="mt-3 truncate"
              style={{
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
