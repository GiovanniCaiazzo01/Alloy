import { useReducer, useState } from "react";

import { DEFAULT_PRESET, BLANK_CANVAS_THEME, PRESETS } from "./constants";
import { themeReducer } from "./utils/themeReducer";
import { cloneTheme } from "./utils/tokens";
import { buildGlobalTokenCSS } from "./utils/export";
import { useDynamicGoogleFont, useShellTheme } from "./hooks";

import {
  AppHeader,
  PresetSidebar,
  EditorTabs,
  PrimitivesTab,
  SemanticsTab,
  TypographyTab,
  ExportModal,
  LivePreviewPanel,
} from "./components";

import type { TabId } from "./types";

export default function DesignTokenStudio() {
  const [theme, dispatch] = useReducer(
    themeReducer,
    DEFAULT_PRESET,
    cloneTheme
  );
  const [activePreset, setActivePreset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabId>("primitives");
  const [showExport, setShowExport] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const shell = useShellTheme(theme);

  useDynamicGoogleFont(theme.fontFamily);

  const applyPreset = (index: number) => {
    const preset = PRESETS[index];
    if (!preset) {
      return;
    }

    setActivePreset(index);
    dispatch({ type: "apply-theme", theme: preset });
  };

  const handleCreateBlankCanvas = () => {
    setActivePreset(-1);
    dispatch({ type: "apply-theme", theme: BLANK_CANVAS_THEME });
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
    setShowExport(true);
  };

  const closeExportModal = () => {
    setShowExport(false);
  };

  const startEditingName = () => {
    setEditingName(true);
  };

  const stopEditingName = () => {
    setEditingName(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: shell.colors.bg,
        color: shell.colors.fg,
        fontFamily: shell.fontFamily,
        overflow: "hidden",
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
        onOpenExport={openExportModal}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <PresetSidebar
          activePreset={activePreset}
          shell={shell}
          onSelectPreset={applyPreset}
          onCreateBlankCanvas={handleCreateBlankCanvas}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <EditorTabs
            activeTab={activeTab}
            shell={shell}
            onTabChange={setActiveTab}
          />
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
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

        <LivePreviewPanel shell={shell} themeName={theme.name} />
      </div>

      {showExport ? (
        <ExportModal theme={theme} onClose={closeExportModal} shell={shell} />
      ) : null}
    </div>
  );
}