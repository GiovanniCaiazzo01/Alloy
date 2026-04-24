import { useEffect } from "react";
import { FONT_LINK_ID } from "../constants/config";

export function useDynamicGoogleFont(fontFamily: string): void {
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