import { useEffect } from "react";
import { useDashboardSidebarHook } from "../../../hooks/shared/useDashboardSidebar";
import { menuItems, type MenuItem, type MenuItemGroup } from "../../../types/variables";

export default function TabManager() {
  const { activeTab } = useDashboardSidebarHook();

  useEffect(() => {
    const body = document.body;
    menuItems.forEach((menu) => {
      if ((menu as any).items) {
        menu = menu as MenuItemGroup;
        menu.items.forEach((submenu) => {
          body.style.setProperty(`--tab-${submenu.id}-display`, "none");
        });
      } else {
        menu = menu as MenuItem;
        body.style.setProperty(`--tab-${menu.id}-display`, "none");
      }
    });
    body.style.setProperty(`--tab-${activeTab}-display`, "flex");
  }, [activeTab]);

  return <></>;
}
