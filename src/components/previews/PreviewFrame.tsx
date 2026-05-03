import type { ReactNode } from "react";
import type { ShellTheme } from "../../types";

type PreviewFrameProps = {
  shell: ShellTheme;
  children: ReactNode;
};

export function PreviewFrame({ shell, children }: PreviewFrameProps) {
  return (
    <div
      style={{
        ["--preview-background" as string]: shell.colors.bg,
        ["--preview-foreground" as string]: shell.colors.fg,
        ["--preview-muted-foreground" as string]: shell.colors.fg3,
        ["--preview-border" as string]: shell.colors.border,
        ["--preview-card" as string]: shell.colors.bg2,
        ["--preview-card-foreground" as string]: shell.colors.fg,
        ["--preview-primary" as string]: shell.colors.brandBg,
        ["--preview-primary-foreground" as string]: shell.colors.brandText,
        ["--preview-secondary" as string]: shell.colors.bg3,
        ["--preview-secondary-foreground" as string]: shell.colors.fg2,
        ["--preview-ring" as string]: shell.colors.brandBg,
        fontFamily: shell.fontFamily,
      }}
      className="min-h-full bg-[var(--preview-background)] text-[var(--preview-foreground)]"
    >
      {children}
    </div>
  );
}
