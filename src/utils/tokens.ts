import type { DesignTheme, PrimitiveCollection, PrimitiveScale } from "../types";

const TYPOGRAPHY_ROLE_ORDER = ["caption", "body", "title", "display"] as const;
const TYPOGRAPHY_SIZE_ORDER = [
  "xs",
  "small",
  "sm",
  "medium",
  "md",
  "large",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
] as const;

const TYPOGRAPHY_GROUPS = [
  { id: "caption", label: "Caption" },
  { id: "body", label: "Body" },
  { id: "title", label: "Title" },
  { id: "display", label: "Display" },
  { id: "other", label: "Other" },
] as const;

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

function getTypographyRoleRank(tokenName: string): number {
  const roleIndex = TYPOGRAPHY_ROLE_ORDER.findIndex(
    (role) => tokenName === role || tokenName.startsWith(`${role}-`)
  );

  return roleIndex === -1 ? TYPOGRAPHY_ROLE_ORDER.length : roleIndex;
}

function getTypographySizeRank(tokenName: string): number {
  const suffix = tokenName.split("-").slice(1).join("-");
  if (!suffix) {
    return -1;
  }

  const sizeIndex = TYPOGRAPHY_SIZE_ORDER.findIndex(
    (size) => suffix === size || suffix.endsWith(`-${size}`)
  );

  return sizeIndex === -1 ? TYPOGRAPHY_SIZE_ORDER.length : sizeIndex;
}

export function sortTypographyEntries<T>(entries: [string, T][]): [string, T][] {
  return [...entries].sort(([leftName], [rightName]) => {
    const roleRankDiff = getTypographyRoleRank(leftName) - getTypographyRoleRank(rightName);
    if (roleRankDiff !== 0) {
      return roleRankDiff;
    }

    const sizeRankDiff = getTypographySizeRank(leftName) - getTypographySizeRank(rightName);
    if (sizeRankDiff !== 0) {
      return sizeRankDiff;
    }

    return leftName.localeCompare(rightName);
  });
}

export function getTypographyGroupId(tokenName: string): string {
  const matchingGroup = TYPOGRAPHY_GROUPS.find(
    (group) => group.id !== "other" && (tokenName === group.id || tokenName.startsWith(`${group.id}-`))
  );

  return matchingGroup?.id ?? "other";
}

export function getTypographyGroupLabel(groupId: string): string {
  return TYPOGRAPHY_GROUPS.find((group) => group.id === groupId)?.label ?? "Other";
}
