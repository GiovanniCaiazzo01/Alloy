import type * as React from "react";
import { cn } from "../../lib/utils";

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-[var(--preview-border)] bg-[var(--preview-background)] px-3 py-1 text-sm text-[var(--preview-foreground)] shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-[var(--preview-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--preview-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--preview-background)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
