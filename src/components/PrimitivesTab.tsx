import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ThemeEditorProps } from "../types";
import { PRIMITIVE_STEPS } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { ColorInput } from "./ui/ColorInput";
import { inputStyle, primaryButtonStyle } from "../styles/buttons";

export function PrimitivesTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newScale, setNewScale] = useState("");

  const handleAddScale = () => {
    dispatch({ type: "add-scale", scale: newScale });
    setNewScale("");
  };

  return (
    <div>
      <SectionTitle shell={shell}>Color Primitives</SectionTitle>
      {Object.entries(theme.primitives).map(([scaleName, steps]) => (
        <div key={scaleName} style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: shell.colors.fg,
              }}
            >
              {scaleName}
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "remove-scale", scale: scaleName })
              }
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: shell.colors.muted,
                padding: 2,
              }}
              title="Remove scale"
              aria-label={`Remove ${scaleName} scale`}
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: 6,
            }}
          >
            {PRIMITIVE_STEPS.map((step) => (
              <div key={step}>
                <div
                  style={{
                    fontSize: 8,
                    color: shell.colors.muted,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {step}
                </div>
                <ColorInput
                  label={`${scaleName} ${step}`}
                  value={steps[step]}
                  onChange={(value) =>
                    dispatch({
                      type: "update-primitive",
                      scale: scaleName,
                      step,
                      value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          placeholder="New scale name (e.g. teal)"
          value={newScale}
          onChange={(event) => setNewScale(event.target.value.toLowerCase())}
          style={{
            ...inputStyle(shell),
            flex: 1,
            fontFamily: shell.fontFamily,
          }}
        />
        <button
          type="button"
          onClick={handleAddScale}
          style={primaryButtonStyle(shell)}
        >
          <Plus size={12} /> Add Scale
        </button>
      </div>
    </div>
  );
}