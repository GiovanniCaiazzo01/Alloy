import { HEX_INPUT_REGEX } from "../../constants/config";
import type { ColorInputProps } from "../../types";

export function ColorInput({
  label,
  value,
  onChange,
}: ColorInputProps) {
  const handleTextChange = (nextValue: string) => {
      if (HEX_INPUT_REGEX.test(nextValue)) {
        onChange(nextValue);
      }
  }

  return (
    <div className="flex items-center gap-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 overflow-hidden shadow-sm">
      <div
        className="w-7 h-7 rounded-md relative flex-shrink-0 border border-black/10"
        style={{ background: value }}
      >
        <input
          aria-label={label ? `${label} color picker` : "Color picker"}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-none"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] text-neutral-400 mb-0.5 tracking-wider truncate uppercase font-semibold">
          {label}
        </div>
        <input
          aria-label={label ? `${label} hex value` : "Hex value"}
          value={value}
          onChange={(event) => handleTextChange(event.target.value)}
          className="bg-transparent border-none outline-none text-neutral-700 dark:text-neutral-200 font-sans text-[11px] w-full select-text uppercase"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}