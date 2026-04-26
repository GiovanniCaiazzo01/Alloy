import type { EditorTabsProps } from "../types";
import { TABS } from "../constants/config";

export function EditorTabs({
  activeTab,
  shell,
  onTabChange,
}: EditorTabsProps) {
  return (
    <div
      className="flex px-4 flex-shrink-0 border-b overflow-x-auto no-scrollbar"
      style={{
        borderColor: shell.colors.border,
        background: shell.colors.bg2,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className="flex items-center gap-1.5 px-4 py-3 text-[10px] tracking-[0.1em] cursor-pointer border-none bg-none border-b-2 uppercase transition-all whitespace-nowrap"
            style={{
              color: isActive ? shell.colors.fg : shell.colors.muted,
              borderBottomColor: isActive ? shell.colors.brandBg : "transparent",
              fontFamily: shell.fontFamily,
              fontWeight: isActive ? 700 : 500,
            }}
          >
            <Icon size={12} /> {label}
          </button>
        );
      })}
    </div>
  );
}