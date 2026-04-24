import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
} from "react";
import {
  Check,
  ChevronRight,
  Code,
  Copy,
  Hash,
  Layers,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";

const PRIMITIVE_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const HEX_INPUT_REGEX = /^#[0-9a-fA-F]{0,6}$/;
const FONT_LINK_ID = "ds-font-loader";
const MONO_FONT_FAMILY = "'DM Mono', monospace";

type PrimitiveStep = (typeof PRIMITIVE_STEPS)[number];
type PrimitiveScale = Record<PrimitiveStep, string>;
type PrimitiveCollection = Record<string, PrimitiveScale>;
type SemanticTokenType = "color";

type SemanticToken = {
  name: string;
  value: string;
  type: SemanticTokenType;
};

type TypographyToken = {
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
};

type TypographyCollection = Record<string, TypographyToken>;
type BreakpointCollection = Record<string, string>;

type DesignTheme = {
  id: string;
  name: string;
  emoji: string;
  fontFamily: string;
  primitives: PrimitiveCollection;
  semantics: SemanticToken[];
  typography: TypographyCollection;
  breakpoints: BreakpointCollection;
};

type ShellTheme = {
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

type TabId = "primitives" | "semantics" | "typography";

type TabItem = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
};

type ThemeAction =
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

type ThemeEditorProps = {
  theme: DesignTheme;
  dispatch: Dispatch<ThemeAction>;
  shell: ShellTheme;
};

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

type SectionTitleProps = {
  children: string;
  shell: ShellTheme;
};

type ExportModalProps = {
  theme: DesignTheme;
  shell: ShellTheme;
  onClose: () => void;
};

type HeaderProps = {
  activePreset: number;
  shell: ShellTheme;
  themeName: string;
  editingName: boolean;
  onStartEditingName: () => void;
  onStopEditingName: () => void;
  onThemeNameChange: (name: string) => void;
  onReset: () => void;
  onOpenExport: () => void;
};

type PresetSidebarProps = {
  activePreset: number;
  shell: ShellTheme;
  onSelectPreset: (index: number) => void;
  onCreateBlankCanvas: () => void;
};

type EditorTabsProps = {
  activeTab: TabId;
  shell: ShellTheme;
  onTabChange: (tab: TabId) => void;
};

type LivePreviewProps = {
  shell: ShellTheme;
  themeName: string;
};

const DEFAULT_PRESET: DesignTheme = {
  id: "default",
  name: "Manrope System",
  emoji: "🎨",
  fontFamily: "Manrope",
  primitives: {
    grey: {
      100: "#f4f4f2",
      200: "#eae9e5",
      300: "#dfddd8",
      400: "#cac7be",
      500: "#a29f98",
      600: "#797772",
      700: "#51504c",
      800: "#282826",
      900: "#0a0a0a",
    },
    primary: {
      100: "#fff3cd",
      200: "#ffe79b",
      300: "#ffdc68",
      400: "#ffd036",
      500: "#ffc404",
      600: "#cc9d03",
      700: "#997602",
      800: "#664e02",
      900: "#332701",
    },
    secondary: {
      100: "#fddfcf",
      200: "#fbbf9e",
      300: "#f99e6e",
      400: "#f77e3d",
      500: "#f55e0d",
      600: "#c44b0a",
      700: "#933808",
      800: "#622605",
      900: "#311303",
    },
    pink: {
      100: "#efe1ee",
      200: "#dfc3dc",
      300: "#d0a4cb",
      400: "#c086b9",
      500: "#b068a8",
      600: "#8d5386",
      700: "#6a3e65",
      800: "#462a43",
      900: "#231522",
    },
  },
  semantics: [
    { name: "background-neutral-primary", value: "grey.100", type: "color" },
    { name: "background-neutral-secondary", value: "grey.200", type: "color" },
    { name: "background-neutral-tertiary", value: "grey.300", type: "color" },
    { name: "background-neutral-disable", value: "grey.400", type: "color" },
    {
      name: "background-neutral-inverse-primary",
      value: "grey.900",
      type: "color",
    },
    {
      name: "background-neutral-inverse-secondary",
      value: "grey.800",
      type: "color",
    },
    {
      name: "background-neutral-inverse-tertiary",
      value: "grey.700",
      type: "color",
    },
    { name: "background-brand-primary-50", value: "#ffc40466", type: "color" },
    { name: "background-brand-secondary", value: "primary.400", type: "color" },
    { name: "background-brand-tertiary", value: "primary.300", type: "color" },
    { name: "background-brand-primary", value: "primary.500", type: "color" },
    { name: "text-neutral-primary", value: "grey.900", type: "color" },
    { name: "text-neutral-secondary", value: "grey.800", type: "color" },
    { name: "text-neutral-tertiary", value: "grey.700", type: "color" },
    { name: "text-neutral-disabled", value: "grey.600", type: "color" },
    { name: "text-inverse-primary", value: "grey.100", type: "color" },
    { name: "text-inverse-secondary", value: "grey.200", type: "color" },
    { name: "text-inverse-tertiary", value: "grey.300", type: "color" },
    { name: "text-brand-primary", value: "primary.900", type: "color" },
    { name: "border-neutral-primary", value: "grey.300", type: "color" },
    { name: "border-neutral-secondary", value: "grey.400", type: "color" },
    { name: "border-neutral-active", value: "primary.500", type: "color" },
    { name: "border-neutral-focus", value: "grey.900", type: "color" },
    { name: "border-inverse-primary", value: "grey.800", type: "color" },
    { name: "border-inverse-secondary", value: "grey.700", type: "color" },
    { name: "border-inverse-active", value: "primary.600", type: "color" },
    { name: "border-inverse-focus", value: "grey.100", type: "color" },
    { name: "border-brand-primary", value: "primary.900", type: "color" },
    { name: "border-brand-secondary", value: "primary.200", type: "color" },
    { name: "border-brand-active", value: "primary.800", type: "color" },
    { name: "border-brand-focus", value: "grey.900", type: "color" },
  ],
  typography: {
    caption: {
      size: "0.813rem",
      lineHeight: "138%",
      letterSpacing: "0",
      weight: 400,
    },
    paragrafo: {
      size: "1rem",
      lineHeight: "138%",
      letterSpacing: "0",
      weight: 400,
    },
    "paragrafo-l": {
      size: "1.25rem",
      lineHeight: "138%",
      letterSpacing: "0",
      weight: 400,
    },
    h5: {
      size: "1.25rem",
      lineHeight: "120%",
      letterSpacing: "0",
      weight: 500,
    },
    h4: {
      size: "1.563rem",
      lineHeight: "120%",
      letterSpacing: "0",
      weight: 500,
    },
    h3: {
      size: "1.938rem",
      lineHeight: "120%",
      letterSpacing: "0",
      weight: 500,
    },
    h2: {
      size: "2.438rem",
      lineHeight: "120%",
      letterSpacing: "0",
      weight: 500,
    },
    h1: {
      size: "3.063rem",
      lineHeight: "120%",
      letterSpacing: "0",
      weight: 500,
    },
  },
  breakpoints: { sm: "27.5rem", md: "46.5rem", lg: "90rem" },
};

const DARK_PRESET: DesignTheme = {
  id: "dark",
  name: "Midnight Neon",
  emoji: "🌌",
  fontFamily: "JetBrains Mono",
  primitives: {
    grey: {
      100: "#e2e8f0",
      200: "#cbd5e1",
      300: "#94a3b8",
      400: "#64748b",
      500: "#475569",
      600: "#334155",
      700: "#1e293b",
      800: "#0f172a",
      900: "#020617",
    },
    primary: {
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    secondary: {
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    pink: {
      100: "#fae8ff",
      200: "#f0abfc",
      300: "#e879f9",
      400: "#d946ef",
      500: "#c026d3",
      600: "#a21caf",
      700: "#86198f",
      800: "#701a75",
      900: "#4a044e",
    },
  },
  semantics: [
    { name: "background-neutral-primary", value: "grey.900", type: "color" },
    { name: "background-neutral-secondary", value: "grey.800", type: "color" },
    { name: "background-neutral-tertiary", value: "grey.700", type: "color" },
    { name: "background-neutral-disable", value: "grey.600", type: "color" },
    {
      name: "background-neutral-inverse-primary",
      value: "grey.100",
      type: "color",
    },
    {
      name: "background-neutral-inverse-secondary",
      value: "grey.200",
      type: "color",
    },
    {
      name: "background-neutral-inverse-tertiary",
      value: "grey.300",
      type: "color",
    },
    { name: "background-brand-primary-50", value: "#6366f166", type: "color" },
    { name: "background-brand-secondary", value: "primary.400", type: "color" },
    { name: "background-brand-tertiary", value: "primary.300", type: "color" },
    { name: "background-brand-primary", value: "primary.500", type: "color" },
    { name: "text-neutral-primary", value: "grey.100", type: "color" },
    { name: "text-neutral-secondary", value: "grey.200", type: "color" },
    { name: "text-neutral-tertiary", value: "grey.300", type: "color" },
    { name: "text-neutral-disabled", value: "grey.500", type: "color" },
    { name: "text-inverse-primary", value: "grey.900", type: "color" },
    { name: "text-inverse-secondary", value: "grey.800", type: "color" },
    { name: "text-inverse-tertiary", value: "grey.700", type: "color" },
    { name: "text-brand-primary", value: "primary.300", type: "color" },
    { name: "border-neutral-primary", value: "grey.700", type: "color" },
    { name: "border-neutral-secondary", value: "grey.600", type: "color" },
    { name: "border-neutral-active", value: "primary.500", type: "color" },
    { name: "border-neutral-focus", value: "grey.100", type: "color" },
    { name: "border-inverse-primary", value: "grey.200", type: "color" },
    { name: "border-inverse-secondary", value: "grey.300", type: "color" },
    { name: "border-inverse-active", value: "primary.400", type: "color" },
    { name: "border-inverse-focus", value: "grey.900", type: "color" },
    { name: "border-brand-primary", value: "primary.500", type: "color" },
    { name: "border-brand-secondary", value: "primary.700", type: "color" },
    { name: "border-brand-active", value: "primary.300", type: "color" },
    { name: "border-brand-focus", value: "grey.100", type: "color" },
  ],
  typography: {
    caption: {
      size: "0.75rem",
      lineHeight: "140%",
      letterSpacing: "0.02em",
      weight: 400,
    },
    paragrafo: {
      size: "0.875rem",
      lineHeight: "150%",
      letterSpacing: "0",
      weight: 400,
    },
    "paragrafo-l": {
      size: "1rem",
      lineHeight: "150%",
      letterSpacing: "0",
      weight: 400,
    },
    h5: {
      size: "1.125rem",
      lineHeight: "130%",
      letterSpacing: "-0.01em",
      weight: 600,
    },
    h4: {
      size: "1.25rem",
      lineHeight: "130%",
      letterSpacing: "-0.01em",
      weight: 600,
    },
    h3: {
      size: "1.5rem",
      lineHeight: "120%",
      letterSpacing: "-0.02em",
      weight: 600,
    },
    h2: {
      size: "2rem",
      lineHeight: "120%",
      letterSpacing: "-0.02em",
      weight: 700,
    },
    h1: {
      size: "2.5rem",
      lineHeight: "110%",
      letterSpacing: "-0.03em",
      weight: 800,
    },
  },
  breakpoints: { sm: "27.5rem", md: "46.5rem", lg: "90rem" },
};

const BLANK_CANVAS_THEME: DesignTheme = {
  id: "custom",
  name: "Custom System",
  emoji: "🎨",
  fontFamily: "Inter",
  primitives: {
    grey: {
      100: "#fafafa",
      200: "#f4f4f5",
      300: "#e4e4e7",
      400: "#d4d4d8",
      500: "#a1a1aa",
      600: "#71717a",
      700: "#52525b",
      800: "#27272a",
      900: "#18181b",
    },
    primary: {
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
  },
  semantics: [
    {
      name: "background-neutral-primary",
      value: "grey.100",
      type: "color",
    },
    {
      name: "text-neutral-primary",
      value: "grey.900",
      type: "color",
    },
    {
      name: "border-neutral-primary",
      value: "grey.300",
      type: "color",
    },
  ],
  typography: {
    caption: {
      size: "0.75rem",
      lineHeight: "140%",
      letterSpacing: "0",
      weight: 400,
    },
    paragrafo: {
      size: "1rem",
      lineHeight: "150%",
      letterSpacing: "0",
      weight: 400,
    },
    h1: {
      size: "2.25rem",
      lineHeight: "120%",
      letterSpacing: "-0.02em",
      weight: 700,
    },
  },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px" },
};

const PRESETS: readonly DesignTheme[] = [DEFAULT_PRESET, DARK_PRESET];

const TABS: readonly TabItem[] = [
  { id: "primitives", label: "Primitives", Icon: Palette },
  { id: "semantics", label: "Semantics", Icon: Layers },
  { id: "typography", label: "Typography", Icon: Type },
];

const PREVIEW_CARDS = [
  { title: "Primitives", desc: "9-step scales", icon: "◈" },
  { title: "Semantics", desc: "Meaningful tokens", icon: "◉" },
] as const;

function createDefaultScale(): PrimitiveScale {
  return {
    100: "#f8f8f8",
    200: "#e8e8e8",
    300: "#d8d8d8",
    400: "#b8b8b8",
    500: "#989898",
    600: "#787878",
    700: "#585858",
    800: "#383838",
    900: "#181818",
  };
}

function cloneTheme(theme: DesignTheme): DesignTheme {
  return {
    ...theme,
    primitives: Object.fromEntries(
      Object.entries(theme.primitives).map(([scaleName, scale]) => [
        scaleName,
        { ...scale },
      ])
    ),
    semantics: theme.semantics.map((semantic) => ({ ...semantic })),
    typography: Object.fromEntries(
      Object.entries(theme.typography).map(([tokenName, token]) => [
        tokenName,
        { ...token },
      ])
    ),
    breakpoints: { ...theme.breakpoints },
  };
}

function themeReducer(state: DesignTheme, action: ThemeAction): DesignTheme {
  switch (action.type) {
    case "apply-theme":
      return cloneTheme(action.theme);

    case "set-theme-name":
      return {
        ...state,
        name: action.name,
      };

    case "set-font-family":
      return {
        ...state,
        fontFamily: action.fontFamily,
      };

    case "update-primitive":
      return {
        ...state,
        primitives: {
          ...state.primitives,
          [action.scale]: {
            ...state.primitives[action.scale],
            [action.step]: action.value,
          },
        },
      };

    case "add-scale": {
      const normalizedScaleName = action.scale.trim().toLowerCase();
      if (!normalizedScaleName || state.primitives[normalizedScaleName]) {
        return state;
      }

      return {
        ...state,
        primitives: {
          ...state.primitives,
          [normalizedScaleName]: createDefaultScale(),
        },
      };
    }

    case "remove-scale": {
      if (!state.primitives[action.scale]) {
        return state;
      }

      const nextPrimitives = { ...state.primitives };
      delete nextPrimitives[action.scale];

      return {
        ...state,
        primitives: nextPrimitives,
      };
    }

    case "add-semantic":
      return {
        ...state,
        semantics: [...state.semantics, action.token],
      };

    case "update-semantic":
      return {
        ...state,
        semantics: state.semantics.map((token, index) =>
          index === action.index ? { ...token, ...action.changes } : token
        ),
      };

    case "remove-semantic":
      return {
        ...state,
        semantics: state.semantics.filter((_, index) => index !== action.index),
      };

    case "update-typography":
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.key]: {
            ...state.typography[action.key],
            ...action.changes,
          },
        },
      };

    default:
      return state;
  }
}

function resolveToken(value: string, primitives: PrimitiveCollection): string {
  if (!value) {
    return "#000000";
  }

  if (value.startsWith("#")) {
    return value;
  }

  const [scale, step] = value.split(".");
  if (!scale || !step) {
    return "#000000";
  }

  return primitives[scale]?.[Number(step) as PrimitiveStep] ?? "#000000";
}

function normalizeHexForLuminance(hexColor: string): string {
  const value = hexColor.replace("#", "");

  if (value.length === 3) {
    return value
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (value.length >= 6) {
    return value.slice(0, 6);
  }

  return "ffffff";
}

function isDarkColor(hexColor: string): boolean {
  const normalized = normalizeHexForLuminance(hexColor);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function generateExport(theme: DesignTheme): string {
  const lines: string[] = [];

  lines.push(`/* Design System: ${theme.name} */`);
  lines.push(`@import "tailwindcss";`);
  lines.push(
    `@import url("https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      theme.fontFamily
    )}:wght@300;400;500;600;700;800&display=swap");`
  );
  lines.push("");
  lines.push("@theme {");
  lines.push(`  --font-sans: "${theme.fontFamily}", sans-serif;`);
  lines.push("");

  for (const [scaleName, steps] of Object.entries(theme.primitives)) {
    for (const step of PRIMITIVE_STEPS) {
      lines.push(`  --color-${scaleName}-${step}: ${steps[step]};`);
    }
    lines.push("");
  }

  for (const semantic of theme.semantics) {
    const value = semantic.value.startsWith("#")
      ? semantic.value
      : `var(--color-${semantic.value.replace(".", "-")})`;

    lines.push(`  --color-${semantic.name}: ${value};`);
  }

  lines.push("");

  for (const [tokenName, token] of Object.entries(theme.typography)) {
    lines.push(`  --text-${tokenName}: ${token.size};`);
    lines.push(`  --text-${tokenName}--line-height: ${token.lineHeight};`);
    lines.push(
      `  --text-${tokenName}--letter-spacing: ${token.letterSpacing};`
    );
  }

  lines.push("");

  for (const [breakpointName, breakpointValue] of Object.entries(
    theme.breakpoints
  )) {
    lines.push(`  --breakpoint-${breakpointName}: ${breakpointValue};`);
  }

  lines.push("}");
  lines.push("");

  for (const [tokenName, token] of Object.entries(theme.typography)) {
    lines.push(`@utility type-${tokenName} {`);
    lines.push("  font-family: var(--font-sans);");
    lines.push(`  font-size: var(--text-${tokenName});`);
    lines.push(`  line-height: var(--text-${tokenName}--line-height);`);
    lines.push(`  letter-spacing: var(--text-${tokenName}--letter-spacing);`);
    lines.push(`  font-weight: ${token.weight};`);
    lines.push("}");
  }

  return lines.join("\n");
}

function buildGlobalTokenCSS(theme: DesignTheme): string {
  const lines: string[] = [];

  lines.push(":root {");
  lines.push(`  --ds-font-sans: "${theme.fontFamily}", sans-serif;`);

  for (const [scaleName, steps] of Object.entries(theme.primitives)) {
    for (const step of PRIMITIVE_STEPS) {
      lines.push(`  --ds-color-${scaleName}-${step}: ${steps[step]};`);
    }
  }

  for (const semantic of theme.semantics) {
    const value = semantic.value.startsWith("#")
      ? semantic.value
      : `var(--ds-color-${semantic.value.replace(".", "-")})`;

    lines.push(`  --ds-color-${semantic.name}: ${value};`);
  }

  for (const [tokenName, token] of Object.entries(theme.typography)) {
    lines.push(`  --ds-text-${tokenName}: ${token.size};`);
    lines.push(`  --ds-text-${tokenName}-lh: ${token.lineHeight};`);
    lines.push(`  --ds-text-${tokenName}-ls: ${token.letterSpacing};`);
    lines.push(`  --ds-text-${tokenName}-w: ${token.weight};`);
  }

  lines.push("}");
  lines.push("body { font-family: var(--ds-font-sans); }");

  return lines.join("\n");
}

function useDynamicGoogleFont(fontFamily: string): void {
  useEffect(() => {
    const existingNode = document.getElementById(FONT_LINK_ID);
    const link =
      existingNode instanceof HTMLLinkElement
        ? existingNode
        : document.createElement("link");

    if (!(existingNode instanceof HTMLLinkElement)) {
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontFamily
    )}:wght@300;400;500;600;700;800&display=swap`;
  }, [fontFamily]);
}

function useShellTheme(theme: DesignTheme): ShellTheme {
  return (() => {
    const semanticMap = new Map(
      theme.semantics
        .filter((token) => token.type === "color")
        .map((token) => [token.name, token.value])
    );

    const getColor = (name: string, fallback: string): string => {
      const tokenValue = semanticMap.get(name);
      return tokenValue ? resolveToken(tokenValue, theme.primitives) : fallback;
    };

    const bg = getColor("background-neutral-primary", "#ffffff");
    const bg2 = getColor("background-neutral-secondary", "#f4f4f5");
    const bg3 = getColor("background-neutral-tertiary", "#e4e4e7");
    const fg = getColor("text-neutral-primary", "#18181b");
    const fg2 = getColor("text-neutral-secondary", "#27272a");
    const fg3 = getColor("text-neutral-tertiary", "#52525b");
    const muted = getColor("text-neutral-disabled", "#a1a1aa");
    const border = getColor("border-neutral-primary", "#e4e4e7");
    const border2 = getColor("border-neutral-secondary", "#d4d4d8");
    const brand = getColor("background-brand-primary", "#7c3aed");
    const brandText = getColor("text-brand-primary", "#ffffff");
    const isDark = isDarkColor(bg);

    return {
      isDark,
      fontFamily: `'${theme.fontFamily}', sans-serif`,
      monoFont: MONO_FONT_FAMILY,
      typography: theme.typography,
      colors: {
        bg,
        bg2,
        bg3,
        fg,
        fg2,
        fg3,
        muted,
        border,
        border2,
        brand,
        brandText,
        brandBg: brand,
        inverseBg: getColor(
          "background-neutral-inverse-primary",
          isDark ? "#ffffff" : "#000000"
        ),
        inverseFg: getColor(
          "text-inverse-primary",
          isDark ? "#000000" : "#ffffff"
        ),
      },
    };
  })();
}

const SectionTitle = function SectionTitle({
  children,
  shell,
}: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.18em",
        color: shell.colors.muted,
        textTransform: "uppercase",
        marginBottom: 14,
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 600,
      }}
    >
      {children}
      <div style={{ flex: 1, height: 1, background: shell.colors.border }} />
    </div>
  );
};

const ColorInput = function ColorInput({
  label,
  value,
  onChange,
}: ColorInputProps) {
  const handleTextChange = (nextValue: string) => {
      if (HEX_INPUT_REGEX.test(nextValue)) {
        onChange(nextValue);
      }
    }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--ds-color-background-neutral-secondary, #f8f8f8)",
        border: "1px solid var(--ds-color-border-neutral-primary, #e4e4e7)",
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: value,
          flexShrink: 0,
          position: "relative",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <input
          aria-label={label ? `${label} color picker` : "Color picker"}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
            border: "none",
            padding: 0,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 9,
            color: "#888",
            marginBottom: 2,
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <input
          aria-label={label ? `${label} hex value` : "Hex value"}
          value={value}
          onChange={(event) => handleTextChange(event.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--ds-color-text-neutral-secondary, #333)",
            fontFamily: "var(--ds-font-sans)",
            fontSize: 11,
            width: "100%",
            userSelect: "text",
          }}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

const PrimitivesTab = function PrimitivesTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newScale, setNewScale] = useState("");

  const handleAddScale = () => {
    dispatch({ type: "add-scale", scale: newScale });
    setNewScale("");
  };

  return (
    <div>
      <SectionTitle shell={shell}>Color Primitives</SectionTitle>
      {Object.entries(theme.primitives).map(([scaleName, steps]) => (
        <div key={scaleName} style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: shell.colors.fg,
              }}
            >
              {scaleName}
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "remove-scale", scale: scaleName })
              }
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: shell.colors.muted,
                padding: 2,
              }}
              title="Remove scale"
              aria-label={`Remove ${scaleName} scale`}
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: 6,
            }}
          >
            {PRIMITIVE_STEPS.map((step) => (
              <div key={step}>
                <div
                  style={{
                    fontSize: 8,
                    color: shell.colors.muted,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {step}
                </div>
                <ColorInput
                  label={`${scaleName} ${step}`}
                  value={steps[step]}
                  onChange={(value) =>
                    dispatch({
                      type: "update-primitive",
                      scale: scaleName,
                      step,
                      value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          placeholder="New scale name (e.g. teal)"
          value={newScale}
          onChange={(event) => setNewScale(event.target.value.toLowerCase())}
          style={{
            ...inputStyle(shell),
            flex: 1,
            fontFamily: shell.fontFamily,
          }}
        />
        <button
          type="button"
          onClick={handleAddScale}
          style={primaryButtonStyle(shell)}
        >
          <Plus size={12} /> Add Scale
        </button>
      </div>
    </div>
  );
};

const SemanticsTab = function SemanticsTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const primitiveOptions = Object.entries(theme.primitives).flatMap(([scaleName]) =>
        PRIMITIVE_STEPS.map((step) => `${scaleName}.${step}`)
      )

  const handleAddSemantic = () => {
    const normalizedName = newName.trim();
    const normalizedValue = newValue.trim();

    if (!normalizedName || !normalizedValue) {
      return;
    }

    dispatch({
      type: "add-semantic",
      token: {
        name: normalizedName,
        value: normalizedValue,
        type: "color",
      },
    });
    setNewName("");
    setNewValue("");
  };

  return (
    <div>
      <SectionTitle shell={shell}>Semantic Tokens</SectionTitle>
      <p
        style={{
          fontSize: 11,
          color: shell.colors.fg3,
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        Map semantic names to primitive values. Use <code>scale.step</code>{" "}
        syntax or raw hex.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {theme.semantics.map((token, index) => (
          <div
            key={`${token.name}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <Hash size={12} color={shell.colors.muted} />
            <input
              value={token.name}
              onChange={(event) =>
                dispatch({
                  type: "update-semantic",
                  index,
                  changes: { name: event.target.value },
                })
              }
              style={{
                flex: 2,
                background: "transparent",
                border: "none",
                outline: "none",
                color: shell.colors.fg,
                fontSize: 11,
                fontFamily: shell.monoFont,
              }}
            />
            <span style={{ color: shell.colors.muted }}>→</span>
            <input
              value={token.value}
              onChange={(event) =>
                dispatch({
                  type: "update-semantic",
                  index,
                  changes: { value: event.target.value },
                })
              }
              style={{
                flex: 1.5,
                background: "transparent",
                border: "none",
                outline: "none",
                color: shell.colors.fg2,
                fontSize: 11,
                fontFamily: shell.monoFont,
              }}
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: resolveToken(token.value, theme.primitives),
                border: `1px solid ${shell.colors.border}`,
              }}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "remove-semantic", index })}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: shell.colors.muted,
              }}
              aria-label={`Remove semantic token ${token.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Token name (e.g. text-brand-primary)"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          style={{
            ...inputStyle(shell),
            flex: 2,
            fontFamily: shell.fontFamily,
          }}
        />
        <select
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          style={{
            ...inputStyle(shell),
            flex: 1.5,
            fontFamily: shell.fontFamily,
            cursor: "pointer",
          }}
        >
          <option value="">Select primitive…</option>
          {primitiveOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddSemantic}
          style={primaryButtonStyle(shell)}
        >
          Add
        </button>
      </div>
    </div>
  );
};

const TypographyTab = function TypographyTab({
  theme,
  dispatch,
  shell,
}: ThemeEditorProps) {
  return (
    <div>
      <SectionTitle shell={shell}>Font Family</SectionTitle>
      <div style={{ marginBottom: 20 }}>
        <input
          value={theme.fontFamily}
          onChange={(event) =>
            dispatch({
              type: "set-font-family",
              fontFamily: event.target.value,
            })
          }
          style={{
            ...inputStyle(shell),
            width: "100%",
            fontFamily: shell.fontFamily,
          }}
        />
        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            background: shell.colors.bg2,
            border: `1px solid ${shell.colors.border}`,
            borderRadius: 6,
            fontFamily: `'${theme.fontFamily}', sans-serif`,
            fontSize: 16,
            color: shell.colors.fg,
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>

      <SectionTitle shell={shell}>Type Scale</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(theme.typography).map(([tokenName, token]) => (
          <div
            key={tokenName}
            style={{
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: shell.colors.fg,
                  width: 100,
                }}
              >
                {tokenName}
              </span>
              <span style={{ fontSize: 10, color: shell.colors.muted }}>
                {token.size} / {token.lineHeight} / {token.weight}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 80px",
                gap: 8,
              }}
            >
              <input
                placeholder="Size"
                value={token.size}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { size: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                placeholder="Line-height"
                value={token.lineHeight}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { lineHeight: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                placeholder="Letter-spacing"
                value={token.letterSpacing}
                onChange={(event) =>
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: { letterSpacing: event.target.value },
                  })
                }
                style={inputStyle(shell)}
              />
              <input
                type="number"
                placeholder="Weight"
                value={token.weight}
                onChange={(event) => {
                  const nextWeight = Number(event.target.value);
                  dispatch({
                    type: "update-typography",
                    key: tokenName,
                    changes: {
                      weight: Number.isNaN(nextWeight)
                        ? token.weight
                        : nextWeight,
                    },
                  });
                }}
                style={inputStyle(shell)}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: `'${theme.fontFamily}', sans-serif`,
                fontSize: token.size,
                lineHeight: token.lineHeight,
                letterSpacing: token.letterSpacing,
                fontWeight: token.weight,
                color: shell.colors.fg,
              }}
            >
              {tokenName.startsWith("h")
                ? "Display Heading Sample"
                : "Body text flows with rhythm and intent."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExportModal = function ExportModal({
  theme,
  onClose,
  shell,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const code = generateExport(theme);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: shell.colors.bg,
          border: `1px solid ${shell.colors.border}`,
          borderRadius: 14,
          width: 720,
          maxWidth: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 24px 80px ${shell.isDark ? "#000000aa" : "#00000033"}`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${shell.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: shell.colors.fg,
              letterSpacing: "0.03em",
            }}
          >
            Export · {theme.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: shell.colors.muted,
              padding: 4,
            }}
            aria-label="Close export modal"
          >
            <X size={16} />
          </button>
        </div>
        <pre
          style={{
            padding: 20,
            overflowY: "auto",
            flex: 1,
            margin: 0,
            fontSize: 11,
            lineHeight: 1.8,
            color: shell.colors.fg2,
            background: shell.colors.bg2,
            fontFamily: shell.monoFont,
            whiteSpace: "pre",
          }}
        >
          {code}
        </pre>
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${shell.colors.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={secondaryButtonStyle(shell)}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            style={primaryButtonStyle(shell)}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppHeader = function AppHeader({
  activePreset,
  shell,
  themeName,
  editingName,
  onStartEditingName,
  onStopEditingName,
  onThemeNameChange,
  onReset,
  onOpenExport,
}: HeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px",
        borderBottom: `1px solid ${shell.colors.border}`,
        background: shell.colors.bg2,
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: shell.colors.brandBg,
            boxShadow: `0 0 12px ${shell.colors.brand}88`,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: shell.colors.fg,
          }}
        >
          Token Studio
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {editingName ? (
          <input
            autoFocus
            value={themeName}
            onChange={(event) => onThemeNameChange(event.target.value)}
            onBlur={onStopEditingName}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onStopEditingName();
              }
            }}
            style={{
              ...inputStyle(shell),
              padding: "4px 10px",
              fontFamily: shell.monoFont,
            }}
          />
        ) : (
          <span
            onClick={onStartEditingName}
            style={{
              fontSize: 11,
              color: shell.colors.fg3,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 5,
              border: "1px dashed transparent",
            }}
            title="Click to rename"
          >
            {themeName}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onReset}
          style={buttonStyle(shell, { disabled: activePreset < 0 })}
          title="Reset to preset"
          disabled={activePreset < 0}
        >
          <RotateCcw size={11} /> Reset
        </button>
        <button type="button" onClick={onOpenExport} style={buttonStyle(shell)}>
          <Code size={11} /> Export
        </button>
        <button
          type="button"
          onClick={onOpenExport}
          style={primaryButtonStyle(shell)}
        >
          <Copy size={11} /> Copy CSS
        </button>
      </div>
    </div>
  );
};

const PresetSidebar = function PresetSidebar({
  activePreset,
  shell,
  onSelectPreset,
  onCreateBlankCanvas,
}: PresetSidebarProps) {
  return (
    <div
      style={{
        width: 210,
        borderRight: `1px solid ${shell.colors.border}`,
        overflowY: "auto",
        padding: "12px 10px",
        background: shell.colors.bg2,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          marginBottom: 8,
          marginTop: 4,
          padding: "0 6px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Presets
      </div>
      {PRESETS.map((preset, index) => {
        const isActive = activePreset === index;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(index)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 7,
              cursor: "pointer",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all .15s",
              border: `1px solid ${
                isActive ? shell.colors.border2 : "transparent"
              }`,
              background: isActive ? shell.colors.bg3 : "transparent",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.primary?.[500] ?? "#ccc",
                }}
              />
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.grey?.[900] ?? "#333",
                }}
              />
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: preset.primitives.grey?.[100] ?? "#fff",
                  border: `1px solid ${shell.colors.border}`,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: isActive ? shell.colors.fg : shell.colors.fg3,
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {preset.name}
            </span>
            {isActive ? (
              <ChevronRight size={10} color={shell.colors.muted} />
            ) : null}
          </button>
        );
      })}

      <div
        style={{
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          marginBottom: 8,
          marginTop: 18,
          padding: "0 6px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Custom
      </div>
      <button
        type="button"
        onClick={onCreateBlankCanvas}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 7,
          cursor: "pointer",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px dashed ${shell.colors.border}`,
          background: "transparent",
          textAlign: "left",
        }}
      >
        <Sparkles size={12} color={shell.colors.brandBg} />
        <span style={{ fontSize: 11, color: shell.colors.fg3 }}>
          Blank Canvas
        </span>
      </button>
    </div>
  );
};

const EditorTabs = function EditorTabs({
  activeTab,
  shell,
  onTabChange,
}: EditorTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${shell.colors.border}`,
        padding: "0 16px",
        flexShrink: 0,
        background: shell.colors.bg2,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            style={{
              padding: "12px 16px",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: isActive ? shell.colors.fg : shell.colors.muted,
              cursor: "pointer",
              border: "none",
              background: "none",
              borderBottom: `2px solid ${
                isActive ? shell.colors.brandBg : "transparent"
              }`,
              transition: "all .2s",
              fontFamily: shell.fontFamily,
              display: "flex",
              alignItems: "center",
              gap: 6,
              textTransform: "uppercase",
              fontWeight: isActive ? 700 : 500,
            }}
            onClick={() => onTabChange(id)}
          >
            <Icon size={12} /> {label}
          </button>
        );
      })}
    </div>
  );
};

const LivePreviewPanel = function LivePreviewPanel({
  shell,
  themeName,
}: LivePreviewProps) {
  return (
    <div
      style={{
        width: 360,
        borderLeft: `1px solid ${shell.colors.border}`,
        overflowY: "auto",
        background: shell.colors.bg2,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${shell.colors.border}`,
          fontSize: 8,
          letterSpacing: "0.2em",
          color: shell.colors.muted,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
          }}
        />
        Live Preview
        <span
          style={{
            color: shell.colors.muted,
            marginLeft: "auto",
            fontSize: 8,
            letterSpacing: "0.1em",
          }}
        >
          {themeName}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div
          style={{
            background: shell.colors.bg,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${shell.colors.border}`,
            boxShadow: `0 4px 30px ${shell.isDark ? "#00000066" : "#00000012"}`,
          }}
        >
          <div
            style={{
              background: shell.colors.bg2,
              padding: "10px 14px",
              borderBottom: `1px solid ${shell.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: shell.colors.fg,
                fontSize: 13,
                letterSpacing: "-0.01em",
              }}
            >
              {themeName}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["Docs", "Blog"].map((label) => (
                <span
                  key={label}
                  style={{ fontSize: 9, color: shell.colors.fg3 }}
                >
                  {label}
                </span>
              ))}
              <span
                style={{
                  fontSize: 9,
                  background: shell.colors.brandBg,
                  color: "#fff",
                  padding: "3px 9px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                Get started
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "22px 14px 18px",
              background: `linear-gradient(160deg, ${shell.colors.bg} 0%, ${shell.colors.bg2} 100%)`,
              borderBottom: `1px solid ${shell.colors.border}`,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: shell.colors.brandBg,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              ✦ New release
            </div>
            <div
              style={{
                fontWeight: 700,
                color: shell.colors.fg,
                fontSize: 20,
                lineHeight: 1.15,
                marginBottom: 10,
                letterSpacing: "-0.02em",
              }}
            >
              Design systems
              <br />
              made semantic
            </div>
            <div
              style={{
                fontSize: 11,
                color: shell.colors.fg3,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Primitive scales, semantic aliases, and type utilities in one
              place.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={primaryButtonStyle(shell)}>
                Get Started →
              </button>
              <button type="button" style={secondaryButtonStyle(shell)}>
                Learn more
              </button>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: shell.colors.bg2,
                  border: `1px solid ${shell.colors.border}`,
                  borderRadius: 8,
                  padding: "10px 11px",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    marginBottom: 4,
                    color: shell.colors.brandBg,
                  }}
                >
                  {card.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: shell.colors.fg,
                    marginBottom: 3,
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: 9, color: shell.colors.fg3 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "0 12px 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: shell.colors.bg2,
                border: `1px solid ${shell.colors.border}`,
                borderRadius: 6,
                padding: "7px 10px",
                gap: 6,
              }}
            >
              <span style={{ color: shell.colors.fg3, fontSize: 11 }}>🔍</span>
              <span style={{ fontSize: 10, color: shell.colors.fg3 }}>
                Search tokens...
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "0 12px 12px",
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Primary", bg: shell.colors.brandBg, fg: "#fff" },
              { label: "Success", bg: "#22c55e22", fg: "#22c55e" },
              { label: "Warning", bg: "#f59e0b22", fg: "#f59e0b" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  background: badge.bg,
                  color: badge.fg,
                  fontSize: 8,
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <div
            style={{
              margin: "0 12px 12px",
              background: shell.colors.bg2,
              border: `1px solid ${shell.colors.border}`,
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 7,
                color: shell.colors.fg3,
                marginBottom: 6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Type Specimen
            </div>
            <div
              style={{
                fontSize: 15,
                color: shell.colors.fg,
                fontWeight: 700,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Display Heading
            </div>
            <div
              style={{
                fontSize: 10,
                color: shell.colors.fg3,
                lineHeight: 1.6,
              }}
            >
              Body text flows naturally with the design token system.
            </div>
          </div>

          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${shell.colors.brandBg}, ${shell.colors.brandBg}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const GlobalTokenStyles = function GlobalTokenStyles({
  theme,
}: {
  theme: DesignTheme;
}) {
  const css = buildGlobalTokenCSS(theme)
  return <style>{css}</style>;
};

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
  }

  const handleReset = () => {
    if (activePreset < 0) {
      return;
    }

    applyPreset(activePreset);
  }

  const handleThemeNameChange = (name: string) => {
    dispatch({ type: "set-theme-name", name });
  }

  const openExportModal = () => {
    setShowExport(true);
  }

  const closeExportModal = () => {
    setShowExport(false);
  }

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
      <GlobalTokenStyles theme={theme} />

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

function inputStyle(shell: ShellTheme): CSSProperties {
  return {
    background: shell.colors.bg,
    border: `1px solid ${shell.colors.border2}`,
    borderRadius: 5,
    padding: "6px 8px",
    fontSize: 11,
    color: shell.colors.fg,
    fontFamily: shell.monoFont,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
}

function buttonStyle(
  shell: ShellTheme,
  options?: { disabled?: boolean }
): CSSProperties {
  const isDisabled = options?.disabled ?? false;

  return {
    padding: "6px 13px",
    borderRadius: 6,
    border: `1px solid ${shell.colors.border}`,
    background: "transparent",
    color: isDisabled ? shell.colors.muted : shell.colors.fg2,
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: shell.fontFamily,
    letterSpacing: "0.04em",
    transition: "all .2s",
    opacity: isDisabled ? 0.55 : 1,
  };
}

function secondaryButtonStyle(shell: ShellTheme): CSSProperties {
  return {
    ...buttonStyle(shell),
    background: "transparent",
  };
}

function primaryButtonStyle(shell: ShellTheme): CSSProperties {
  return {
    ...buttonStyle(shell),
    background: shell.colors.brandBg,
    border: `1px solid ${shell.colors.brand}`,
    color: "#fff",
    fontWeight: 600,
  };
}

