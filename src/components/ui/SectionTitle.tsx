import type { SectionTitleProps } from "../../types";

export function SectionTitle({ children, shell }: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.18em",
        color: shell.colors.muted,
        textTransform: "uppercase",
        marginBottom: 14,
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 600,
      }}
    >
      {children}
      <div style={{ flex: 1, height: 1, background: shell.colors.border }} />
    </div>
  );
}