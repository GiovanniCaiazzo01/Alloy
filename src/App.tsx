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
  LivePreviewPanel,
} from "./components";

import type { TabId } from "./types";

const loadExportModal = () =>
  import("./components/ExportModal").then((module) => ({
    default: module.ExportModal,
  }));

const loadImportModal = () =>
  import("./components/ImportModal").then((module) => ({
    default: module.ImportModal,
  }));

const ExportModal = lazy(loadExportModal);
const ImportModal = lazy(loadImportModal);

function preloadExportModal(): void {
  void loadExportModal();
}

function preloadImportModal(): void {
  void loadImportModal();
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
      dispatch({ type: "apply-theme", theme: preset });
    });
  };

  const handleCreateBlankCanvas = () => {
    startTransition(() => {
      setActivePreset(-1);
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

  const handleImportTokens = (payload: string) => {
    const importedTheme = importThemeFromJson(payload, theme);

    startTransition(() => {
      setActivePreset(-1);
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
        onStartEditingName={startEditingName}
        onStopEditingName={stopEditingName}
        onThemeNameChange={handleThemeNameChange}
        onReset={handleReset}
        onOpenImport={openImportModal}
        onOpenExport={openExportModal}
        onPreloadImport={preloadImportModal}
        onPreloadExport={preloadExportModal}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          <PresetSidebar
            activePreset={activePreset}
            shell={shell}
            onSelectPreset={applyPreset}
            onCreateBlankCanvas={handleCreateBlankCanvas}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
        </div>

        <LivePreviewPanel
          shell={previewShell}
          themeName={deferredTheme.name}
        />
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
