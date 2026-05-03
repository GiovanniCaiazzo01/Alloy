import { ArrowRight, Sparkles } from "lucide-react";
import type { PreviewSceneProps } from "./types";
import { PreviewFrame } from "./PreviewFrame";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Card, CardContent } from "../shadcn/card";

export default function MarketingPreview({ shell, themeName }: PreviewSceneProps) {
  return (
    <PreviewFrame shell={shell}>
      <div className="p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--preview-border)] bg-[linear-gradient(160deg,var(--preview-background),var(--preview-card))] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[var(--preview-primary)]/15 blur-3xl" />
          <div className="relative max-w-2xl">
            <Badge className="mb-4 gap-1.5">
              <Sparkles size={12} /> {themeName}
            </Badge>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-[var(--preview-foreground)]">
              Build token systems that already feel like production.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--preview-muted-foreground)]">
              Live-edit your primitives, semantics, and type scale while previewing a polished interface that responds to every token change.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>
                Start designing <ArrowRight size={14} />
              </Button>
              <Button variant="outline">See component previews</Button>
            </div>
          </div>

          <div className="relative mt-8 grid gap-3 md:grid-cols-3">
            {[
              ["Semantic colors", "Intent-first aliases that stay readable at scale."],
              ["Role-based type", "Display, title, and body tokens for real UI systems."],
              ["Export-ready", "Tailwind v4 output that mirrors what you preview."],
            ].map(([title, description]) => (
              <Card key={title} className="bg-[var(--preview-background)]/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="mt-2 text-sm text-[var(--preview-muted-foreground)]">{description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}
