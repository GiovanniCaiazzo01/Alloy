import { Palette, Layers, Type } from "lucide-react";
import type { TabItem } from "../types";

export const HEX_INPUT_REGEX = /^#[0-9a-fA-F]{0,6}$/;
export const FONT_LINK_ID = "ds-font-loader";
export const MONO_FONT_FAMILY = "'DM Mono', monospace";

export const TABS: readonly TabItem[] = [
  { id: "primitives", label: "Primitives", Icon: Palette },
  { id: "semantics", label: "Semantics", Icon: Layers },
  { id: "typography", label: "Typography", Icon: Type },
];

export const PREVIEW_CARDS = [
  { title: "Primitives", desc: "9-step scales", icon: "◈" },
  { title: "Semantics", desc: "Meaningful tokens", icon: "◉" },
] as const;

export function createDefaultTypographyToken() {
  return {
    size: "1rem",
    lineHeight: "150%",
    letterSpacing: "0",
    weight: 400,
  };
}

export function createDefaultScale(): Record<number, string> {
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
