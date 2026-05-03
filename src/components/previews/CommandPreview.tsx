import { Clock3, Search, Sparkles } from "lucide-react";
import type { PreviewSceneProps } from "./types";
import { PreviewFrame } from "./PreviewFrame";
import { Badge } from "../shadcn/badge";
import { Input } from "../shadcn/input";

const results = [
  { title: "Create title-small", hint: "Typography" },
  { title: "Open semantic aliases", hint: "Semantics" },
  { title: "Export current theme", hint: "Output" },
] as const;

export default function CommandPreview({ shell }: PreviewSceneProps) {
  return (
    <PreviewFrame shell={shell}>
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[24px] border border-[var(--preview-border)] bg-[var(--preview-card)] shadow-sm">
          <div className="border-b border-[var(--preview-border)] p-4">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--preview-border)] bg-[var(--preview-background)] px-3 py-2.5">
              <Search size={16} className="text-[var(--preview-muted-foreground)]" />
              <Input className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search tokens, scenes, or commands..." />
              <Badge variant="outline">/</Badge>
            </div>
          </div>
          <div className="grid gap-2 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--preview-muted-foreground)]">
              <Sparkles size={12} /> Quick actions
            </div>
            {results.map((result) => (
              <button
                key={result.title}
                type="button"
                className="flex items-center justify-between rounded-xl border border-[var(--preview-border)] bg-[var(--preview-background)] px-3 py-3 text-left cursor-pointer hover:bg-[var(--preview-secondary)]"
              >
                <div>
                  <div className="text-sm font-medium">{result.title}</div>
                  <div className="mt-1 text-xs text-[var(--preview-muted-foreground)]">{result.hint}</div>
                </div>
                <Clock3 size={14} className="text-[var(--preview-muted-foreground)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}
