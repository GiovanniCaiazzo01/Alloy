import type { DesignTheme, ThemeAction } from "../types";
import { PRIMITIVE_STEPS } from "../types";
import { createDefaultScale, createDefaultTypographyToken } from "../constants/config";
import { cloneTheme, sortTypographyEntries } from "./tokens";

export function themeReducer(state: DesignTheme, action: ThemeAction): DesignTheme {
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
            [normalizedScaleName]: createDefaultScale() as typeof state.primitives[string],
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

    case "add-typography": {
      const normalizedKey = action.key.trim().toLowerCase();
      if (!normalizedKey || state.typography[normalizedKey]) {
        return state;
      }

      const nextTypographyEntries = sortTypographyEntries([
        ...Object.entries(state.typography),
        [
          normalizedKey,
          {
            ...createDefaultTypographyToken(),
            ...action.token,
          },
        ],
      ]);

      return {
        ...state,
        typography: Object.fromEntries(nextTypographyEntries),
      };
    }

    case "remove-typography": {
      if (!state.typography[action.key]) {
        return state;
      }

      const nextTypography = { ...state.typography };
      delete nextTypography[action.key];

      return {
        ...state,
        typography: nextTypography,
      };
    }

    case "sort-typography":
      return {
        ...state,
        typography: Object.fromEntries(sortTypographyEntries(Object.entries(state.typography))),
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

export { PRIMITIVE_STEPS, createDefaultScale };
