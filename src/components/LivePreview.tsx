import { lazy, startTransition, Suspense, useState } from "react";
import { ChevronRight, LayoutTemplate, PanelsTopLeft, Search, ShieldCheck, X } from "lucide-react";
import type { LivePreviewProps } from "../types";

const sceneDefinitions = [
  {
    id: "form-auth",
    label: "Form + Auth",
    Icon: ShieldCheck,
    load: () => import("./previews/FormAuthPreview"),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    Icon: PanelsTopLeft,
    load: () => import("./previews/DashboardPreview"),
  },
  {
    id: "marketing",
    label: "Marketing",
    Icon: LayoutTemplate,
    load: () => import("./previews/MarketingPreview"),
  },
  {
    id: "command",
    label: "Command",
    Icon: Search,
    load: () => import("./previews/CommandPreview"),
  },
] as const;

type PreviewSceneId = (typeof sceneDefinitions)[number]["id"];

const lazySceneModules = Object.fromEntries(
  sceneDefinitions.map((scene) => [scene.id, lazy(scene.load)])
) as Record<PreviewSceneId, ReturnType<typeof lazy>>;

function PreviewFallback({ shell }: Pick<LivePreviewProps, "shell">) {
  return (
    <div className="p-4 sm:p-6">
      <div
        className="animate-pulse rounded-[28px] border p-6"
        style={{
          borderColor: shell.colors.border,
          background: shell.colors.bg,
        }}
      >
        <div className="h-4 w-28 rounded" style={{ background: shell.colors.bg3 }} />
        <div className="mt-4 h-8 w-2/3 rounded" style={{ background: shell.colors.bg3 }} />
        <div className="mt-3 h-4 w-full rounded" style={{ background: shell.colors.bg3 }} />
        <div className="mt-2 h-4 w-4/5 rounded" style={{ background: shell.colors.bg3 }} />
      </div>
    </div>
  );
}

export function LivePreviewPanel({ shell, themeName, onToggleOpen }: LivePreviewProps) {
  const [activeScene, setActiveScene] = useState<PreviewSceneId>("form-auth");
  const ActiveScene = lazySceneModules[activeScene];

  return (
    <aside
      className="w-full border-t md:w-[min(38vw,460px)] md:border-l md:border-t-0 flex-shrink-0 flex flex-col min-h-[320px] md:min-h-0"
      style={{
        borderColor: shell.colors.border,
        background: shell.colors.bg2,
      }}
    >
      <div
        className="px-4 py-3 border-b flex items-start justify-between gap-3"
        style={{ borderColor: shell.colors.border }}
      >
        <div>
          <div
            className="text-[8px] uppercase tracking-[0.22em] font-bold"
            style={{ color: shell.colors.brandBg }}
          >
            Live Preview Lab
          </div>
          <div className="mt-1 text-[13px] font-semibold" style={{ color: shell.colors.fg }}>
            Preview real UI with your tokens
          </div>
          <div className="mt-1 text-[10px]" style={{ color: shell.colors.fg3 }}>
            {themeName}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium cursor-pointer border"
          style={{
            borderColor: shell.colors.border,
            color: shell.colors.fg3,
            background: shell.colors.bg,
          }}
        >
          <X size={12} /> Close
        </button>
      </div>

      <div className="px-3 py-3 border-b overflow-x-auto no-scrollbar" style={{ borderColor: shell.colors.border }}>
        <div className="flex gap-2 min-w-max">
          {sceneDefinitions.map((scene) => {
            const isActive = scene.id === activeScene;
            const Icon = scene.Icon;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setActiveScene(scene.id);
                  });
                }}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold cursor-pointer"
                style={{
                  borderColor: isActive ? shell.colors.border2 : shell.colors.border,
                  background: isActive ? shell.colors.bg : "transparent",
                  color: isActive ? shell.colors.fg : shell.colors.fg3,
                }}
              >
                <Icon size={12} /> {scene.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3 border-b" style={{ borderColor: shell.colors.border }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-medium" style={{ color: shell.colors.fg }}>
              Active scene
            </div>
            <div className="text-[10px] mt-1" style={{ color: shell.colors.fg3 }}>
              Switch between app surfaces without loading all of them upfront.
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-[10px] font-medium"
            style={{ color: shell.colors.brandBg }}
          >
            Lazy loaded <ChevronRight size={12} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<PreviewFallback shell={shell} />}>
          <ActiveScene shell={shell} themeName={themeName} />
        </Suspense>
      </div>
    </aside>
  );
}
