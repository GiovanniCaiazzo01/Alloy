import type { EditorTabsProps } from "../types";
import { TABS } from "../constants/config";

export function EditorTabs({
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
}