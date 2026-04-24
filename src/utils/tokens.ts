import type { DesignTheme, PrimitiveStep, PrimitiveCollection } from "../types";

export function resolveToken(value: string, primitives: PrimitiveCollection): string {
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

export function normalizeHexForLuminance(hexColor: string): string {
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

export function isDarkColor(hexColor: string): boolean {
  const normalized = normalizeHexForLuminance(hexColor);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export function cloneTheme(theme: DesignTheme): DesignTheme {
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