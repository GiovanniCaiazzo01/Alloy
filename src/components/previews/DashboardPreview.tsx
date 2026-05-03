import { ArrowUpRight, Layers3, Palette, Type } from "lucide-react";
import type { PreviewSceneProps } from "./types";
import { PreviewFrame } from "./PreviewFrame";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../shadcn/card";

const metrics = [
  { label: "Primitives", value: "24", icon: Palette },
  { label: "Semantics", value: "62", icon: Layers3 },
  { label: "Type Tokens", value: "08", icon: Type },
] as const;

export default function DashboardPreview({ shell }: PreviewSceneProps) {
  return (
    <PreviewFrame shell={shell}>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--preview-muted-foreground)]">
              Dashboard cards
            </div>
            <div className="mt-1 text-xl font-semibold">Token health overview</div>
          </div>
          <Button variant="outline" size="sm">
            Export report <ArrowUpRight size={14} />
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Active</Badge>
                    <Icon size={15} className="text-[var(--preview-primary)]" />
                  </div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="text-3xl">{metric.value}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent changes</CardTitle>
            <CardDescription>Track the latest adjustments before exporting the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Updated display-large letter spacing",
              "Imported semantic aliases from Figma Tokens",
              "Added body-small for dense interfaces",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border border-[var(--preview-border)] bg-[var(--preview-background)] px-3 py-2"
              >
                <span className="text-sm">{item}</span>
                <Badge variant="outline">Draft</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PreviewFrame>
  );
}
