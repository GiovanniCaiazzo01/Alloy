import {
  lazy,
  Suspense,
  startTransition,
  useDeferredValue,
  useReducer,
  useState,
} from "react";

import { DEFAULT_PRESET, BLANK_CANVAS_THEME, PRESETS } from "./constants";
import { themeReducer } from "./utils/themeReducer";
import { cloneTheme } from "./utils/tokens";
import { buildGlobalTokenCSS } from "./utils/export";
import { importThemeFromJson } from "./utils/import";
import { useDynamicGoogleFont, useShellTheme } from "./hooks";

import {
  AppHeader,
  PresetSidebar,
  EditorTabs,
  PrimitivesTab,
  SemanticsTab,
  TypographyTab,
} from "./components";

import type { ImportedThemeState, TabId } from "./types";

const loadExportModal = () =>
  import("./components/ExportModal").then((module) => ({
    default: module.ExportModal,
  }));

const loadImportModal = () =>
  import("./components/ImportModal").then((module) => ({
    default: module.ImportModal,
  }));

const loadLivePreviewPanel = () =>
  import("./components/LivePreview").then((module) => ({
    default: module.LivePreviewPanel,
  }));

const ExportModal = lazy(loadExportModal);
const ImportModal = lazy(loadImportModal);
const LivePreviewPanel = lazy(loadLivePreviewPanel);

function preloadExportModal(): void {
  void loadExportModal();
}

function preloadImportModal(): void {
  void loadImportModal();
}

function preloadLivePreviewPanel(): void {
  void loadLivePreviewPanel();
}

export default function DesignTokenStudio() {
  const [theme, dispatch] = useReducer(
    themeReducer,
    DEFAULT_PRESET,
    cloneTheme
  );
  const [activePreset, setActivePreset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabId>("primitives");
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [importedThemeState, setImportedThemeState] = useState<ImportedThemeState | null>(
    null
  );

  const shell = useShellTheme(theme);
  const deferredTheme = useDeferredValue(theme);
  const previewShell = useShellTheme(deferredTheme);

  useDynamicGoogleFont(theme.fontFamily);

  const applyPreset = (index: number) => {
    const preset = PRESETS[index];
    if (!preset) {
      return;
    }

    startTransition(() => {
      setActivePreset(index);
      setImportedThemeState(null);
      dispatch({ type: "apply-theme", theme: preset });
    });
  };

  const handleCreateBlankCanvas = () => {
    startTransition(() => {
      setActivePreset(-1);
      setImportedThemeState(null);
      dispatch({ type: "apply-theme", theme: BLANK_CANVAS_THEME });
    });
  };

  const handleReset = () => {
    if (activePreset < 0) {
      return;
    }

    applyPreset(activePreset);
  };

  const handleThemeNameChange = (name: string) => {
    dispatch({ type: "set-theme-name", name });
  };

  const openExportModal = () => {
    preloadExportModal();
    setShowExport(true);
  };

  const openImportModal = () => {
    preloadImportModal();
    setShowImport(true);
  };

  const closeImportModal = () => {
    setShowImport(false);
  };

  const closeExportModal = () => {
    setShowExport(false);
  };

  const handleImportTokens = (payload: string, sourceLabel: string) => {
    const importedTheme = importThemeFromJson(payload, theme);

    startTransition(() => {
      setActivePreset(-1);
      setImportedThemeState({
        sourceLabel,
        summary: importedTheme.summary,
      });
      dispatch({ type: "apply-theme", theme: importedTheme.theme });
      setShowImport(false);
    });
  };

  const startEditingName = () => {
    setEditingName(true);
  };

  const stopEditingName = () => {
    setEditingName(false);
  };

  const handleTabChange = (tab: TabId) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  const togglePreview = () => {
    if (!previewOpen) {
      preloadLivePreviewPanel();
    }

    startTransition(() => {
      setPreviewOpen((current) => !current);
    });
  };

  return (
    <div
      className="theme-transition flex flex-col h-screen overflow-hidden"
      style={{
        background: shell.colors.bg,
        color: shell.colors.fg,
        fontFamily: shell.fontFamily,
      }}
    >
      <style>{buildGlobalTokenCSS(theme)}</style>

      <AppHeader
        activePreset={activePreset}
        shell={shell}
        themeName={theme.name}
        editingName={editingName}
        previewOpen={previewOpen}
        onStartEditingName={startEditingName}
        onStopEditingName={stopEditingName}
        onThemeNameChange={handleThemeNameChange}
        onReset={handleReset}
        onOpenImport={openImportModal}
        onOpenExport={openExportModal}
        onTogglePreview={togglePreview}
        onPreloadImport={preloadImportModal}
        onPreloadExport={preloadExportModal}
      />

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col md:flex-row overflow-hidden">
          <PresetSidebar
            activePreset={activePreset}
            shell={shell}
            themeName={theme.name}
            importedThemeState={importedThemeState}
            onSelectPreset={applyPreset}
            onCreateBlankCanvas={handleCreateBlankCanvas}
          />

          <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
            <div
              className="px-4 py-3 border-b flex items-center justify-between gap-3"
              style={{
                borderColor: shell.colors.border,
                background: shell.colors.bg,
              }}
            >
              <div>
                <div
                  className="text-[8px] uppercase font-bold tracking-[0.22em]"
                  style={{ color: shell.colors.brandBg }}
                >
                  Focused Editor
                </div>
                <div className="mt-1 text-[13px] font-semibold" style={{ color: shell.colors.fg }}>
                  Editing {theme.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-medium" style={{ color: shell.colors.fg2 }}>
                  {activeTab}
                </div>
                <div className="mt-1 text-[10px]" style={{ color: shell.colors.fg3 }}>
                  Preview opens as a separate lab.
                </div>
              </div>
            </div>
            <EditorTabs
              activeTab={activeTab}
              shell={shell}
              onTabChange={handleTabChange}
            />
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-5">
              {activeTab === "primitives" ? (
                <PrimitivesTab theme={theme} dispatch={dispatch} shell={shell} />
              ) : null}
              {activeTab === "semantics" ? (
                <SemanticsTab theme={theme} dispatch={dispatch} shell={shell} />
              ) : null}
              {activeTab === "typography" ? (
                <TypographyTab theme={theme} dispatch={dispatch} shell={shell} />
              ) : null}
            </div>
          </div>

          {previewOpen ? (
            <Suspense fallback={null}>
              <LivePreviewPanel
                shell={previewShell}
                themeName={deferredTheme.name}
                onToggleOpen={togglePreview}
              />
            </Suspense>
          ) : null}
        </div>
      </div>

      {showImport ? (
        <Suspense fallback={null}>
          <ImportModal
            shell={shell}
            onClose={closeImportModal}
            onImport={handleImportTokens}
          />
        </Suspense>
      ) : null}

      {showExport ? (
        <Suspense fallback={null}>
          <ExportModal theme={theme} onClose={closeExportModal} shell={shell} />
        </Suspense>
      ) : null}
    </div>
  );
}
