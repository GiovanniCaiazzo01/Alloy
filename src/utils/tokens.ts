import type { DesignTheme, PrimitiveCollection, PrimitiveScale } from "../types";

export function getSortedPrimitiveSteps(scale: PrimitiveScale): number[] {
  return Object.keys(scale)
    .map((step) => Number(step))
    .filter((step) => Number.isInteger(step))
    .sort((left, right) => left - right);
}

export function parsePrimitiveReference(
  value: string
): { scale: string; step: number } | null {
  const normalizedValue = value.trim();
  const unwrappedValue =
    normalizedValue.startsWith("{") && normalizedValue.endsWith("}")
      ? normalizedValue.slice(1, -1).trim()
      : normalizedValue;

  if (!unwrappedValue) {
    return null;
  }

  const segments = unwrappedValue
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  const step = Number(segments.at(-1));
  if (!Number.isInteger(step)) {
    return null;
  }

  return {
    scale: segments.slice(0, -1).join("-"),
    step,
  };
}

export function isPrimitiveReference(value: string): boolean {
  return parsePrimitiveReference(value) !== null;
}

export function resolveToken(
  value: string,
  primitives: PrimitiveCollection
): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("#")) {
    return value;
  }

  const reference = parsePrimitiveReference(value);
  if (!reference) {
    return value;
  }

  return primitives[reference.scale]?.[reference.step] ?? null;
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
  if (!hexColor.startsWith("#")) {
    return false;
  }

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
