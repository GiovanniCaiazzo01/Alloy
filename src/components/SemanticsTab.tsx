import { useState } from "react";
import { Hash, Trash2 } from "lucide-react";
import type { ThemeEditorProps } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { getSortedPrimitiveSteps, resolveToken } from "../utils/tokens";

export function SemanticsTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const primitiveOptions = Object.entries(theme.primitives).flatMap(([scaleName]) =>
    getSortedPrimitiveSteps(theme.primitives[scaleName]).map(
      (step) => `${scaleName}.${step}`
    )
  );

  const handleAddSemantic = () => {
    const normalizedName = newName.trim();
    const normalizedValue = newValue.trim();

    if (!normalizedName || !normalizedValue) {
      return;
    }

    dispatch({
      type: "add-semantic",
      token: {
        name: normalizedName,
        value: normalizedValue,
        type: "color",
      },
    });
    setNewName("");
    setNewValue("");
  };

  return (
    <div>
      <SectionTitle shell={shell}>Semantic Tokens</SectionTitle>
      <p
        className="text-[11px] mb-4 leading-relaxed"
        style={{ color: shell.colors.fg3 }}
      >
        Map semantic names to primitive values. Use <code>scale.step</code> syntax or raw hex.
      </p>

      <div className="flex flex-col gap-2 mb-5">
        {theme.semantics.map((token, index) => (
          <div
            key={`${token.name}-${index}`}
            className="flex items-center gap-2 rounded-lg border px-2.5 py-2 group"
            style={{
              background: shell.colors.bg2,
              borderColor: shell.colors.border,
            }}
          >
            <Hash size={12} style={{ color: shell.colors.muted }} />
            <input
              value={token.name}
              onChange={(event) =>
                dispatch({
                  type: "update-semantic",
                  index,
                  changes: { name: event.target.value },
                })
              }
              className="flex-[2] bg-transparent border-none outline-none text-[11px]"
              style={{
                color: shell.colors.fg,
                fontFamily: shell.monoFont,
              }}
            />
            <span style={{ color: shell.colors.muted }}>→</span>
            <input
              value={token.value}
              onChange={(event) =>
                dispatch({
                  type: "update-semantic",
                  index,
                  changes: { value: event.target.value },
                })
              }
              className="flex-[1.5] bg-transparent border-none outline-none text-[11px]"
              style={{
                color: shell.colors.fg2,
                fontFamily: shell.monoFont,
              }}
            />
            <div
              className="w-[18px] h-[18px] rounded-md border"
              style={{
                background:
                  resolveToken(token.value, theme.primitives) ?? shell.colors.bg,
                borderColor: shell.colors.border,
              }}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "remove-semantic", index })}
              className="bg-transparent border-none cursor-pointer p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: shell.colors.muted }}
              aria-label={`Remove semantic token ${token.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-[2]">
          <div className="text-[9px] uppercase font-bold tracking-wider mb-1 px-1 opacity-50">Token Name</div>
          <input
            placeholder="e.g. text-primary"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
            style={{
              background: shell.colors.bg,
              borderColor: shell.colors.border,
              color: shell.colors.fg,
              fontFamily: shell.fontFamily,
            }}
          />
        </div>
        <div className="flex-[1.5]">
          <div className="text-[9px] uppercase font-bold tracking-wider mb-1 px-1 opacity-50">Value</div>
          <select
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            className="w-full px-2 py-1.5 rounded-md border outline-none text-[11px] cursor-pointer"
            style={{
              background: shell.colors.bg,
              borderColor: shell.colors.border,
              color: shell.colors.fg,
              fontFamily: shell.fontFamily,
            }}
          >
            <option value="">Select primitive…</option>
            {primitiveOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleAddSemantic}
          className="px-4 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all h-[31px]"
          style={{
            background: shell.colors.brandBg,
            color: shell.colors.brandText,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
