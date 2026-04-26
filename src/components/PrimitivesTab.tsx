import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ThemeEditorProps } from "../types";
import { PRIMITIVE_STEPS } from "../types";
import { SectionTitle } from "./ui/SectionTitle";
import { ColorInput } from "./ui/ColorInput";

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
        <div
          key={scaleName}
          className="mb-[22px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.12em]"
              style={{ color: shell.colors.fg }}
            >
              {scaleName}
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "remove-scale", scale: scaleName })
              }
              className="bg-transparent border-none cursor-pointer p-0.5"
              style={{ color: shell.colors.muted }}
              title="Remove scale"
              aria-label={`Remove ${scaleName} scale`}
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div
            className="grid grid-cols-[repeat(9,minmax(56px,1fr))] gap-1.5 overflow-x-auto no-scrollbar pb-2"
          >
            {PRIMITIVE_STEPS.map((step) => (
              <div key={step}>
                <div
                  className="text-[8px] text-center mb-1 uppercase font-bold opacity-50"
                  style={{ color: shell.colors.muted }}
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

      <div className="flex gap-2 mt-2 items-end">
        <div className="flex-1">
          <div className="text-[9px] uppercase font-bold tracking-wider mb-1 px-1 opacity-50">New Scale</div>
          <input
            placeholder="e.g. teal"
            value={newScale}
            onChange={(event) => setNewScale(event.target.value.toLowerCase())}
            className="w-full px-3 py-1.5 rounded-md border outline-none text-[11px]"
            style={{
              background: shell.colors.bg,
              borderColor: shell.colors.border2,
              color: shell.colors.fg,
              fontFamily: shell.fontFamily,
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddScale}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all h-[31px]"
          style={{
            background: shell.colors.brandBg,
            color: shell.colors.brandText,
          }}
        >
          <Plus size={12} /> Add Scale
        </button>
      </div>
    </div>
  );
}
