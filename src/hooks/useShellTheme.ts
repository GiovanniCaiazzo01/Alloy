import type { DesignTheme, ShellTheme } from "../types";
import { MONO_FONT_FAMILY } from "../constants/config";
import { resolveToken, isDarkColor } from "../utils/tokens";

export function useShellTheme(theme: DesignTheme): ShellTheme {
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