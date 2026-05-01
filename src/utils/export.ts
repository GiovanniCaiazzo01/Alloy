import type { DesignTheme } from "../types";
import {
  getSortedPrimitiveSteps,
  parsePrimitiveReference,
} from "./tokens";

function toCssTokenValue(value: string, prefix: string): string {
  const reference = parsePrimitiveReference(value);

  return reference
    ? `var(${prefix}${reference.scale}-${reference.step})`
    : value;
}

export function generateExport(theme: DesignTheme): string {
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
    for (const step of getSortedPrimitiveSteps(steps)) {
      lines.push(`  --color-${scaleName}-${step}: ${steps[step]};`);
    }
    lines.push("");
  }

  for (const semantic of theme.semantics) {
    lines.push(
      `  --color-${semantic.name}: ${toCssTokenValue(semantic.value, "--color-")};`
    );
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

export function buildGlobalTokenCSS(theme: DesignTheme): string {
  const lines: string[] = [];

  lines.push(":root {");
  lines.push(`  --ds-font-sans: "${theme.fontFamily}", sans-serif;`);

  for (const [scaleName, steps] of Object.entries(theme.primitives)) {
    for (const step of getSortedPrimitiveSteps(steps)) {
      lines.push(`  --ds-color-${scaleName}-${step}: ${steps[step]};`);
    }
  }

  for (const semantic of theme.semantics) {
    lines.push(
      `  --ds-color-${semantic.name}: ${toCssTokenValue(semantic.value, "--ds-color-")};`
    );
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
