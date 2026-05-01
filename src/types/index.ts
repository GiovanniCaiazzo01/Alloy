import type { LucideIcon } from "lucide-react";

export const PRIMITIVE_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type PrimitiveStep = number;
export type PrimitiveScale = Record<PrimitiveStep, string>;
export type PrimitiveCollection = Record<string, PrimitiveScale>;

export type SemanticTokenType = "color";

export type SemanticToken = {
  name: string;
  value: string;
  type: SemanticTokenType;
};

export type TypographyToken = {
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
};

export type TypographyCollection = Record<string, TypographyToken>;
export type BreakpointCollection = Record<string, string>;

export type DesignTheme = {
  id: string;
  name: string;
  emoji: string;
  fontFamily: string;
  primitives: PrimitiveCollection;
  semantics: SemanticToken[];
  typography: TypographyCollection;
  breakpoints: BreakpointCollection;
};

export type ShellThemeSource = Pick<
  DesignTheme,
  "fontFamily" | "primitives" | "semantics" | "typography"
>;

export type ShellTheme = {
  isDark: boolean;
  fontFamily: string;
  monoFont: string;
  typography: TypographyCollection;
  colors: {
    bg: string;
    bg2: string;
    bg3: string;
    fg: string;
    fg2: string;
    fg3: string;
    muted: string;
    border: string;
    border2: string;
    brand: string;
    brandText: string;
    brandBg: string;
    inverseBg: string;
    inverseFg: string;
  };
};

export type TabId = "primitives" | "semantics" | "typography";

export type TabItem = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
};

export type ThemeAction =
  | { type: "apply-theme"; theme: DesignTheme }
  | { type: "set-theme-name"; name: string }
  | { type: "set-font-family"; fontFamily: string }
  | {
    type: "update-primitive";
    scale: string;
    step: PrimitiveStep;
    value: string;
  }
  | { type: "add-scale"; scale: string }
  | { type: "remove-scale"; scale: string }
  | { type: "add-semantic"; token: SemanticToken }
  | {
    type: "update-semantic";
    index: number;
    changes: Partial<Pick<SemanticToken, "name" | "value">>;
  }
  | { type: "remove-semantic"; index: number }
  | {
    type: "update-typography";
    key: string;
    changes: Partial<TypographyToken>;
  };

export type ThemeEditorProps = {
  theme: DesignTheme;
  dispatch: import("react").Dispatch<ThemeAction>;
  shell: ShellTheme;
};

export type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export type SectionTitleProps = {
  children: string;
  shell: ShellTheme;
};

export type ExportModalProps = {
  theme: DesignTheme;
  shell: ShellTheme;
  onClose: () => void;
};

export type ImportModalProps = {
  shell: ShellTheme;
  onClose: () => void;
  onImport: (payload: string) => void;
};

export type HeaderProps = {
  activePreset: number;
  shell: ShellTheme;
  themeName: string;
  editingName: boolean;
  onStartEditingName: () => void;
  onStopEditingName: () => void;
  onThemeNameChange: (name: string) => void;
  onReset: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onPreloadImport: () => void;
  onPreloadExport: () => void;
};

export type PresetSidebarProps = {
  activePreset: number;
  shell: ShellTheme;
  onSelectPreset: (index: number) => void;
  onCreateBlankCanvas: () => void;
};

export type EditorTabsProps = {
  activeTab: TabId;
  shell: ShellTheme;
  onTabChange: (tab: TabId) => void;
};

export type LivePreviewProps = {
  shell: ShellTheme;
  themeName: string;
};
