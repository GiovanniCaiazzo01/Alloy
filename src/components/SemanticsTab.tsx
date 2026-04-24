import { useState } from "react";
import { Hash, Trash2 } from "lucide-react";
import type { ThemeEditorProps } from "../types";
import { PRIMITIVE_STEPS } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { inputStyle, primaryButtonStyle } from "../styles/buttons";
import { resolveToken } from "../utils/tokens";

export function SemanticsTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const primitiveOptions = Object.entries(theme.primitives).flatMap(([scaleName]) =>
        PRIMITIVE_STEPS.map((step) => `${scaleName}.${step}`)
      )

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
        style={{
          fontSize: 11,
          color: shell.colors.fg3,
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        Map semantic names to primitive values. Use <code>scale.step</code>{" "}
        syntax or raw hex.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {theme.semantics.map((token, index) => (
          <div
            key={`${token.name}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <Hash size={12} color={shell.colors.muted} />
            <input
              value={token.name}
              onChange={(event) =>
                dispatch({
                  type: "update-semantic",
                  index,
                  changes: { name: event.target.value },
                })
              }
              style={{
                flex: 2,
                background: "transparent",
                border: "none",
                outline: "none",
                color: shell.colors.fg,
                fontSize: 11,
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
              style={{
                flex: 1.5,
                background: "transparent",
                border: "none",
                outline: "none",
                color: shell.colors.fg2,
                fontSize: 11,
                fontFamily: shell.monoFont,
              }}
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: resolveToken(token.value, theme.primitives),
                border: `1px solid ${shell.colors.border}`,
              }}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "remove-semantic", index })}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: shell.colors.muted,
              }}
              aria-label={`Remove semantic token ${token.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Token name (e.g. text-brand-primary)"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          style={{
            ...inputStyle(shell),
            flex: 2,
            fontFamily: shell.fontFamily,
          }}
        />
        <select
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          style={{
            ...inputStyle(shell),
            flex: 1.5,
            fontFamily: shell.fontFamily,
            cursor: "pointer",
          }}
        >
          <option value="">Select primitive…</option>
          {primitiveOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddSemantic}
          style={primaryButtonStyle(shell)}
        >
          Add
        </button>
      </div>
    </div>
  );
}