import { useState } from "react";
import { ArrowDownUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import type { ThemeEditorProps } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { createDefaultTypographyToken } from "../constants/config";
import { getTypographyGroupId, getTypographyGroupLabel } from "../utils/tokens";

function getTypographySampleCopy(tokenName: string): string {
  if (tokenName.startsWith("display") || tokenName.startsWith("title")) {
    return "Display heading sample";
  }

  if (tokenName === "caption") {
    return "Compact notes and supporting metadata.";
  }

  return "Body text flows with rhythm and intent.";
}

export function TypographyTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newTokenName, setNewTokenName] = useState("");
  const [newToken, setNewToken] = useState(createDefaultTypographyToken);
  const typographyGroups = Object.entries(theme.typography).reduce<
    Array<{ id: string; label: string; entries: Array<[string, (typeof theme.typography)[string]]> }>
  >((groups, entry) => {
    const groupId = getTypographyGroupId(entry[0]);
    const existingGroup = groups.find((group) => group.id === groupId);

    if (existingGroup) {
      existingGroup.entries.push(entry);
      return groups;
    }

    return [
      ...groups,
      {
        id: groupId,
        label: getTypographyGroupLabel(groupId),
        entries: [entry],
      },
    ];
  }, []);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  const handleAddTypography = () => {
    const normalizedKey = newTokenName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!normalizedKey || theme.typography[normalizedKey]) {
      return;
    }

    dispatch({
      type: "add-typography",
      key: normalizedKey,
      token: {
        ...newToken,
        weight: Number.isFinite(newToken.weight) ? newToken.weight : 400,
      },
    });
    setNewTokenName("");
    setNewToken(createDefaultTypographyToken());
  };

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
      <div className="flex flex-col gap-4">
        {typographyGroups.map((group) => (
          <section key={group.id} className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="flex items-center gap-2 px-1 py-1 text-left cursor-pointer"
            >
              <ChevronDown
                size={12}
                className={`transition-transform ${collapsedGroups[group.id] ? "-rotate-90" : "rotate-0"}`}
                style={{ color: shell.colors.muted }}
              />
              <div
                className="text-[8px] uppercase font-bold tracking-[0.22em]"
                style={{ color: shell.colors.brandBg }}
              >
                {group.label}
              </div>
              <div
                className="text-[8px] font-mono"
                style={{ color: shell.colors.muted }}
              >
                {group.entries.length}
              </div>
              <div
                className="h-px flex-1"
                style={{ background: shell.colors.border }}
              />
            </button>

            {!collapsedGroups[group.id]
              ? group.entries.map(([tokenName, token]) => (
              <div
                key={tokenName}
                className="typography-token-card p-3 rounded-lg border"
                style={{
                  background: shell.colors.bg2,
                  borderColor: shell.colors.border,
                }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider w-[132px] sm:w-[148px] truncate"
                    style={{ color: shell.colors.fg }}
                  >
                    {tokenName}
                  </span>
                  <span className="text-[10px] opacity-50 font-mono">
                    {token.size} / {token.lineHeight} / {token.weight}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "remove-typography", key: tokenName })}
                    className="ml-auto bg-transparent border-none cursor-pointer p-0.5"
                    style={{ color: shell.colors.muted }}
                    title="Remove typography token"
                    aria-label={`Remove typography token ${tokenName}`}
                  >
                    <Trash2 size={12} />
                  </button>
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
                            weight: Number.isNaN(nextWeight) ? token.weight : nextWeight,
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
                  {getTypographySampleCopy(tokenName)}
                </div>
              </div>
              ))
              : null}
          </section>
        ))}
      </div>

      <div className="mt-5 rounded-xl border p-3.5" style={{
        background: shell.colors.bg2,
        borderColor: shell.colors.border,
      }}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: shell.colors.fg }}>
              Add Typography Token
            </div>
            <div className="text-[10px] mt-1" style={{ color: shell.colors.fg3 }}>
              Add role-based tokens like <code>body-small</code> or <code>display-xl</code>.
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "sort-typography" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer border shrink-0"
            style={{
              borderColor: shell.colors.border,
              background: shell.colors.bg,
              color: shell.colors.fg,
            }}
          >
            <ArrowDownUp size={12} /> Sort Tokens
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2 items-end">
          <div className="sm:col-span-2 xl:col-span-1">
            <div className="text-[8px] uppercase font-bold opacity-40 px-1 mb-1">Name</div>
            <input
              placeholder="e.g. body-small"
              value={newTokenName}
              onChange={(event) => setNewTokenName(event.target.value)}
              className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
              style={{
                background: shell.colors.bg,
                borderColor: shell.colors.border,
                color: shell.colors.fg,
                fontFamily: shell.monoFont,
              }}
            />
          </div>
          <div>
            <div className="text-[8px] uppercase font-bold opacity-40 px-1 mb-1">Size</div>
            <input
              value={newToken.size}
              onChange={(event) =>
                setNewToken((current) => ({ ...current, size: event.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
              style={{
                background: shell.colors.bg,
                borderColor: shell.colors.border,
                color: shell.colors.fg,
              }}
            />
          </div>
          <div>
            <div className="text-[8px] uppercase font-bold opacity-40 px-1 mb-1">Line</div>
            <input
              value={newToken.lineHeight}
              onChange={(event) =>
                setNewToken((current) => ({ ...current, lineHeight: event.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
              style={{
                background: shell.colors.bg,
                borderColor: shell.colors.border,
                color: shell.colors.fg,
              }}
            />
          </div>
          <div>
            <div className="text-[8px] uppercase font-bold opacity-40 px-1 mb-1">Track</div>
            <input
              value={newToken.letterSpacing}
              onChange={(event) =>
                setNewToken((current) => ({ ...current, letterSpacing: event.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
              style={{
                background: shell.colors.bg,
                borderColor: shell.colors.border,
                color: shell.colors.fg,
              }}
            />
          </div>
          <div>
            <div className="text-[8px] uppercase font-bold opacity-40 px-1 mb-1">Weight</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={newToken.weight}
                onChange={(event) => {
                  const nextWeight = Number(event.target.value);
                  setNewToken((current) => ({
                    ...current,
                    weight: Number.isNaN(nextWeight) ? current.weight : nextWeight,
                  }));
                }}
                className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
                style={{
                  background: shell.colors.bg,
                  borderColor: shell.colors.border,
                  color: shell.colors.fg,
                }}
              />
              <button
                type="button"
                onClick={handleAddTypography}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all shrink-0"
                style={{
                  background: shell.colors.brandBg,
                  color: shell.colors.brandText,
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
