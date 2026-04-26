import type { SectionTitleProps } from "../../types";

export function SectionTitle({ children, shell }: SectionTitleProps) {
  return (
    <div
      className="text-[10px] tracking-[0.18em] uppercase mb-3.5 mt-1 flex items-center gap-2.5 font-semibold"
      style={{ color: shell.colors.muted }}
    >
      {children}
      <div className="flex-1 h-px" style={{ background: shell.colors.border }} />
    </div>
  );
}