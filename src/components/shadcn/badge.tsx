import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--preview-primary)] text-[var(--preview-primary-foreground)]",
        secondary:
          "border-transparent bg-[var(--preview-secondary)] text-[var(--preview-secondary-foreground)]",
        outline:
          "border-[var(--preview-border)] text-[var(--preview-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
