import type {
  BreakpointCollection,
  DesignTheme,
  PrimitiveCollection,
  PrimitiveScale,
  SemanticToken,
  TypographyCollection,
  TypographyToken,
} from "../types";
import {
  getSortedPrimitiveSteps,
  isDarkColor,
  isPrimitiveReference,
  resolveToken,
} from "./tokens";

const CONTAINER_SEGMENTS = new Set([
  "token",
  "tokens",
  "primitive",
  "primitives",
  "color",
  "colors",
  "semantic",
  "semantics",
  "theme",
  "themes",
  "foundation",
  "foundations",
  "core",
  "global",
  "globals",
]);

type ImportedThemeData = Partial<
  Pick<
    DesignTheme,
    "name" | "fontFamily" | "primitives" | "semantics" | "typography" | "breakpoints"
  >
>;

export type ThemeImportSummary = {
  primitiveScales: number;
  primitiveTokens: number;
  semantics: number;
  typography: number;
  breakpoints: number;
};

export type ThemeImportResult = {
  theme: DesignTheme;
  summary: ThemeImportSummary;
};

type TokenLeaf = {
  path: string[];
  type: string;
  value: unknown;
};

export function importThemeFromJson(
  sourceText: string,
  baseTheme: DesignTheme
): ThemeImportResult {
  let parsedSource: unknown;

  try {
    parsedSource = JSON.parse(sourceText);
  } catch {
    throw new Error("The import payload must be valid JSON.");
  }

  if (!isRecord(parsedSource)) {
    throw new Error("The import payload must be a JSON object.");
  }

  const directTheme = extractDirectThemeFields(parsedSource);
  const structuredTokens = extractStructuredTokens(parsedSource);
  const importedTheme: ImportedThemeData = {
    name: directTheme.name ?? structuredTokens.name,
    fontFamily: directTheme.fontFamily ?? structuredTokens.fontFamily,
    primitives: directTheme.primitives ?? structuredTokens.primitives,
    semantics: directTheme.semantics ?? structuredTokens.semantics,
    typography: directTheme.typography ?? structuredTokens.typography,
    breakpoints: directTheme.breakpoints ?? structuredTokens.breakpoints,
  };

  const summary = buildImportSummary(importedTheme);
  const hasSupportedTokens =
    summary.primitiveTokens > 0 ||
    summary.semantics > 0 ||
    summary.typography > 0 ||
    summary.breakpoints > 0 ||
    Boolean(importedTheme.fontFamily) ||
    Boolean(importedTheme.name);

  if (!hasSupportedTokens) {
    throw new Error(
      "No supported tokens were found. Paste a token JSON object with primitives, semantic colors, typography, or breakpoints."
    );
  }

  return {
    theme: mergeImportedTheme(baseTheme, importedTheme),
    summary,
  };
}

function buildImportSummary(importedTheme: ImportedThemeData): ThemeImportSummary {
  const primitiveScales = importedTheme.primitives
    ? Object.keys(importedTheme.primitives).length
    : 0;
  const primitiveTokens = importedTheme.primitives
    ? Object.values(importedTheme.primitives).reduce(
        (count, scale) => count + getSortedPrimitiveSteps(scale).length,
        0
      )
    : 0;

  return {
    primitiveScales,
    primitiveTokens,
    semantics: importedTheme.semantics?.length ?? 0,
    typography: Object.keys(importedTheme.typography ?? {}).length,
    breakpoints: Object.keys(importedTheme.breakpoints ?? {}).length,
  };
}

function mergeImportedTheme(
  baseTheme: DesignTheme,
  importedTheme: ImportedThemeData
): DesignTheme {
  const primitives = importedTheme.primitives ?? baseTheme.primitives;
  const nextSemantics = importedTheme.semantics
    ? importedTheme.semantics
    : importedTheme.primitives
      ? ensureShellSemantics(filterCompatibleSemantics(baseTheme.semantics, primitives), primitives)
      : baseTheme.semantics;

  return {
    ...baseTheme,
    name: importedTheme.name ?? baseTheme.name,
    fontFamily: importedTheme.fontFamily ?? baseTheme.fontFamily,
    primitives,
    semantics: nextSemantics,
    typography: importedTheme.typography ?? baseTheme.typography,
    breakpoints: importedTheme.breakpoints ?? baseTheme.breakpoints,
  };
}

function filterCompatibleSemantics(
  semantics: SemanticToken[],
  primitives: PrimitiveCollection
): SemanticToken[] {
  return semantics.filter((token) => {
    if (!isPrimitiveReference(token.value)) {
      return true;
    }

    return resolveToken(token.value, primitives) !== null;
  });
}

function ensureShellSemantics(
  semantics: SemanticToken[],
  primitives: PrimitiveCollection
): SemanticToken[] {
  const semanticMap = new Map(semantics.map((token) => [token.name, token]));
  const scaleNames = Object.keys(primitives);

  if (!scaleNames.length) {
    return semantics;
  }

  const neutralScale =
    findScaleName(scaleNames, [/^grey$/, /^gray$/, /^greyscale$/, /^grayscale$/, /^neutral$/]) ??
    findScaleName(scaleNames, [/grey|gray|neutral/]) ??
    scaleNames[0];
  const brandScale =
    findScaleName(scaleNames, [/^primary$/, /^brand$/, /^accent$/]) ??
    findScaleName(scaleNames, [/primary|brand|accent/]) ??
    scaleNames.find((scaleName) => scaleName !== neutralScale) ??
    neutralScale;
  const neutralSteps = getSortedPrimitiveSteps(primitives[neutralScale] ?? {});
  const brandSteps = getSortedPrimitiveSteps(primitives[brandScale] ?? {});

  if (!neutralSteps.length || !brandSteps.length) {
    return semantics;
  }

  const lightestNeutral = `${neutralScale}.${pickStepFromStart(neutralSteps, 0)}`;
  const lighterNeutral = `${neutralScale}.${pickStepFromStart(neutralSteps, 1)}`;
  const lightNeutral = `${neutralScale}.${pickStepFromStart(neutralSteps, 2)}`;
  const borderNeutral = `${neutralScale}.${pickStepFromStart(neutralSteps, 2)}`;
  const borderNeutralAlt = `${neutralScale}.${pickStepFromStart(neutralSteps, 3)}`;
  const darkestNeutral = `${neutralScale}.${pickStepFromEnd(neutralSteps, 0)}`;
  const darkerNeutral = `${neutralScale}.${pickStepFromEnd(neutralSteps, 1)}`;
  const darkNeutral = `${neutralScale}.${pickStepFromEnd(neutralSteps, 2)}`;
  const mutedNeutral = `${neutralScale}.${pickStepFromEnd(neutralSteps, 3)}`;
  const brandPrimaryStep = pickClosestStep(brandSteps, 500);
  const brandPrimary = `${brandScale}.${brandPrimaryStep}`;
  const resolvedBrandColor = resolveToken(brandPrimary, primitives);
  const brandText =
    resolvedBrandColor && resolvedBrandColor.startsWith("#") && isDarkColor(resolvedBrandColor)
      ? lightestNeutral
      : darkestNeutral;

  const fallbackSemantics: SemanticToken[] = [
    createSemanticToken("background-neutral-primary", lightestNeutral),
    createSemanticToken("background-neutral-secondary", lighterNeutral),
    createSemanticToken("background-neutral-tertiary", lightNeutral),
    createSemanticToken("background-neutral-inverse-primary", darkestNeutral),
    createSemanticToken("text-neutral-primary", darkestNeutral),
    createSemanticToken("text-neutral-secondary", darkerNeutral),
    createSemanticToken("text-neutral-tertiary", darkNeutral),
    createSemanticToken("text-neutral-disabled", mutedNeutral),
    createSemanticToken("text-inverse-primary", lightestNeutral),
    createSemanticToken("border-neutral-primary", borderNeutral),
    createSemanticToken("border-neutral-secondary", borderNeutralAlt),
    createSemanticToken("background-brand-primary", brandPrimary),
    createSemanticToken("text-brand-primary", brandText),
  ];

  for (const token of fallbackSemantics) {
    if (!semanticMap.has(token.name)) {
      semanticMap.set(token.name, token);
    }
  }

  return Array.from(semanticMap.values());
}

function createSemanticToken(name: string, value: string): SemanticToken {
  return { name, value, type: "color" };
}

function findScaleName(scaleNames: string[], patterns: RegExp[]): string | undefined {
  return scaleNames.find((scaleName) => patterns.some((pattern) => pattern.test(scaleName)));
}

function pickStepFromStart(steps: number[], index: number): number {
  return steps[Math.min(index, steps.length - 1)] ?? steps[0] ?? 500;
}

function pickStepFromEnd(steps: number[], index: number): number {
  return steps[Math.max(0, steps.length - 1 - index)] ?? steps.at(-1) ?? 500;
}

function pickClosestStep(steps: number[], target: number): number {
  return (
    steps.reduce((closest, step) =>
      Math.abs(step - target) < Math.abs(closest - target) ? step : closest
    ) ?? steps[0] ?? target
  );
}

function extractDirectThemeFields(source: Record<string, unknown>): ImportedThemeData {
  const primitives = parseDirectPrimitiveCollection(source.primitives);
  const semantics = parseDirectSemantics(source.semantics);
  const typographyResult = parseDirectTypographyCollection(source.typography);
  const breakpoints = parseDirectBreakpoints(source.breakpoints);

  return {
    name: typeof source.name === "string" ? source.name.trim() || undefined : undefined,
    fontFamily:
      (typeof source.fontFamily === "string" && source.fontFamily.trim()) ||
      typographyResult?.fontFamily,
    primitives,
    semantics,
    typography: typographyResult?.tokens,
    breakpoints,
  };
}

function extractStructuredTokens(source: Record<string, unknown>): ImportedThemeData {
  const leaves = collectTokenLeaves(source);
  const primitives: PrimitiveCollection = {};
  const semantics: SemanticToken[] = [];
  const typography: TypographyCollection = {};
  const breakpoints: BreakpointCollection = {};
  let fontFamily: string | undefined;

  for (const leaf of leaves) {
    const normalizedPath = normalizePath(leaf.path);
    if (!normalizedPath.length) {
      continue;
    }

    const rootSegment = normalizedPath[0];

    if (isColorToken(leaf.type)) {
      const colorValue = normalizeImportedValue(leaf.value);
      if (!colorValue) {
        continue;
      }

      if (rootSegment === "semantic" || rootSegment === "semantics") {
        const tokenName = stripLeadingContainers(normalizedPath).join("-");
        if (tokenName) {
          semantics.push(createSemanticToken(tokenName, colorValue));
        }
        continue;
      }

      const step = Number(normalizedPath.at(-1));
      if (Number.isInteger(step)) {
        const scaleSegments = stripLeadingContainers(normalizedPath.slice(0, -1));
        const scaleName = scaleSegments.join("-");

        if (!scaleName) {
          continue;
        }

        const scale = primitives[scaleName] ?? {};
        scale[step] = colorValue;
        primitives[scaleName] = scale;
        continue;
      }

      const tokenName = stripLeadingContainers(normalizedPath).join("-");
      if (tokenName) {
        semantics.push(createSemanticToken(tokenName, colorValue));
      }

      continue;
    }

    if (leaf.type.toLowerCase() === "typography") {
      const tokenName = stripLeadingContainers(normalizedPath).join("-");
      const parsedTypography = parseTypographyValue(leaf.value);

      if (tokenName && parsedTypography) {
        typography[tokenName] = parsedTypography.token;
        fontFamily ??= parsedTypography.fontFamily;
      }

      continue;
    }

    if (isFontFamilyToken(leaf.type)) {
      const familyValue = readString(leaf.value);
      if (familyValue) {
        fontFamily ??= familyValue;
      }
      continue;
    }

    if (
      (rootSegment === "breakpoint" || rootSegment === "breakpoints") &&
      isBreakpointToken(leaf.type)
    ) {
      const breakpointName = stripLeadingContainers(normalizedPath).join("-");
      const breakpointValue = normalizeImportedValue(leaf.value);

      if (breakpointName && breakpointValue) {
        breakpoints[breakpointName] = breakpointValue;
      }
    }
  }

  return {
    fontFamily,
    primitives: Object.keys(primitives).length ? primitives : undefined,
    semantics: semantics.length ? semantics : undefined,
    typography: Object.keys(typography).length ? typography : undefined,
    breakpoints: Object.keys(breakpoints).length ? breakpoints : undefined,
  };
}

function collectTokenLeaves(source: Record<string, unknown>, path: string[] = []): TokenLeaf[] {
  const leaves: TokenLeaf[] = [];

  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("$")) {
      continue;
    }

    const nextPath = [...path, key];
    if (isTokenLeaf(value)) {
      leaves.push({
        path: nextPath,
        type: typeof value.$type === "string" ? value.$type : "",
        value: value.$value,
      });
      continue;
    }

    if (isRecord(value)) {
      leaves.push(...collectTokenLeaves(value, nextPath));
    }
  }

  return leaves;
}

function parseDirectPrimitiveCollection(value: unknown): PrimitiveCollection | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const primitives: PrimitiveCollection = {};

  for (const [scaleName, scaleValue] of Object.entries(value)) {
    if (!isRecord(scaleValue)) {
      continue;
    }

    const normalizedScaleName = normalizeSegment(scaleName);
    const scale: PrimitiveScale = {};

    for (const [stepName, stepValue] of Object.entries(scaleValue)) {
      const step = Number(stepName);
      const colorValue = isTokenLeaf(stepValue)
        ? normalizeImportedValue(stepValue.$value)
        : normalizeImportedValue(stepValue);

      if (!normalizedScaleName || !Number.isInteger(step) || !colorValue) {
        continue;
      }

      scale[step] = colorValue;
    }

    if (getSortedPrimitiveSteps(scale).length) {
      primitives[normalizedScaleName] = scale;
    }
  }

  return Object.keys(primitives).length ? primitives : undefined;
}

function parseDirectSemantics(value: unknown): SemanticToken[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const semantics = value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = typeof item.name === "string" ? item.name.trim() : "";
    const tokenValue = normalizeImportedValue(item.value);
    if (!name || !tokenValue) {
      return [];
    }

    return [
      {
        name,
        value: tokenValue,
        type: "color" as const,
      },
    ];
  });

  return semantics.length ? semantics : undefined;
}

function parseDirectTypographyCollection(
  value: unknown
): { tokens: TypographyCollection; fontFamily?: string } | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const tokens: TypographyCollection = {};
  let fontFamily: string | undefined;

  for (const [tokenName, tokenValue] of Object.entries(value)) {
    const normalizedName = normalizeSegment(tokenName);
    const parsedTypography = isTokenLeaf(tokenValue)
      ? parseTypographyValue(tokenValue.$value)
      : parseTypographyValue(tokenValue);

    if (!normalizedName || !parsedTypography) {
      continue;
    }

    tokens[normalizedName] = parsedTypography.token;
    fontFamily ??= parsedTypography.fontFamily;
  }

  return Object.keys(tokens).length ? { tokens, fontFamily } : undefined;
}

function parseDirectBreakpoints(value: unknown): BreakpointCollection | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const breakpoints = Object.fromEntries(
    Object.entries(value)
      .map(([breakpointName, breakpointValue]) => {
        const normalizedName = normalizeSegment(breakpointName);
        const normalizedValue = normalizeImportedValue(breakpointValue);

        return normalizedName && normalizedValue
          ? [normalizedName, normalizedValue]
          : null;
      })
      .filter((entry): entry is [string, string] => entry !== null)
  );

  return Object.keys(breakpoints).length ? breakpoints : undefined;
}

function parseTypographyValue(
  value: unknown
): { token: TypographyToken; fontFamily?: string } | null {
  if (!isRecord(value)) {
    return null;
  }

  const size = readString(value.size ?? value.fontSize);
  const lineHeight = readString(value.lineHeight) ?? "120%";
  const letterSpacing = readString(value.letterSpacing) ?? "0";
  const weight = readWeight(value.weight ?? value.fontWeight);
  const fontFamily = readString(value.fontFamily);

  if (!size) {
    return null;
  }

  return {
    token: {
      size,
      lineHeight,
      letterSpacing,
      weight,
    },
    fontFamily,
  };
}

function readWeight(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedWeight = Number(value.trim());
    if (Number.isFinite(parsedWeight)) {
      return parsedWeight;
    }
  }

  return 400;
}

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue || undefined;
}

function normalizeImportedValue(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const normalizedReferenceValue = normalizeReferenceValue(trimmedValue);
  return normalizedReferenceValue ?? trimmedValue;
}

function normalizeReferenceValue(value: string): string | null {
  const cleanedValue = value.replaceAll("/", ".");
  const matchesReference = /^\{?[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)+\}?$/.test(
    cleanedValue
  );
  if (!matchesReference) {
    return null;
  }

  const unwrappedValue =
    cleanedValue.startsWith("{") && cleanedValue.endsWith("}")
      ? cleanedValue.slice(1, -1)
      : cleanedValue;
  const segments = stripLeadingContainers(
    unwrappedValue
      .split(".")
      .map((segment) => normalizeSegment(segment))
      .filter(Boolean)
  );

  if (!segments.length) {
    return null;
  }

  const step = Number(segments.at(-1));
  return Number.isInteger(step)
    ? `${segments.slice(0, -1).join("-")}.${step}`
    : segments.join("-");
}

function normalizePath(path: string[]): string[] {
  return path.map((segment) => normalizeSegment(segment)).filter(Boolean);
}

function normalizeSegment(segment: string): string {
  return segment
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function stripLeadingContainers(segments: string[]): string[] {
  const normalizedSegments = [...segments];

  while (
    normalizedSegments.length > 1 &&
    CONTAINER_SEGMENTS.has(normalizedSegments[0] ?? "")
  ) {
    normalizedSegments.shift();
  }

  return normalizedSegments;
}

function isColorToken(type: string): boolean {
  return type.toLowerCase() === "color";
}

function isBreakpointToken(type: string): boolean {
  const normalizedType = type.toLowerCase();
  return normalizedType === "dimension" || normalizedType === "number";
}

function isFontFamilyToken(type: string): boolean {
  const normalizedType = type.toLowerCase();
  return normalizedType === "fontfamily" || normalizedType === "fontfamilies";
}

function isTokenLeaf(value: unknown): value is { $type?: unknown; $value: unknown } {
  return isRecord(value) && "$value" in value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
