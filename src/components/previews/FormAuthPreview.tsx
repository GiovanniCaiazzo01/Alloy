import { ArrowRight, Sparkles } from "lucide-react";
import type { PreviewSceneProps } from "./types";
import { PreviewFrame } from "./PreviewFrame";
import { Button } from "../shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../shadcn/card";
import { Input } from "../shadcn/input";
import { Badge } from "../shadcn/badge";

export default function FormAuthPreview({ shell, themeName }: PreviewSceneProps) {
  return (
    <PreviewFrame shell={shell}>
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="secondary">Auth Flow</Badge>
            <span className="text-xs text-[var(--preview-muted-foreground)]">{themeName}</span>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="relative border-b border-[var(--preview-border)] bg-[linear-gradient(145deg,var(--preview-card),var(--preview-background))]">
              <div className="mb-3 flex items-center gap-2 text-[var(--preview-primary)]">
                <Sparkles size={16} />
                <Badge>Pro</Badge>
              </div>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to continue editing tokens and exporting your UI foundation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-medium">Email</label>
                <Input placeholder="name@studio.dev" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Password</label>
                  <button type="button" className="text-xs text-[var(--preview-primary)] cursor-pointer">
                    Forgot password?
                  </button>
                </div>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Login</Button>
                <Button variant="outline" className="flex-1">SSO</Button>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-[var(--preview-border)] pt-4 text-xs text-[var(--preview-muted-foreground)]">
              <span>Protected with encrypted sessions</span>
              <ArrowRight size={14} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </PreviewFrame>
  );
}
