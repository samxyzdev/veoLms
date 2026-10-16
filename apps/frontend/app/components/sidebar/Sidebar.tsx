import { SidebarFooterCard } from "./SidebarFooter";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavigation } from "./SidebarNavigation";

import type { SidebarProps } from "./types";

export function Sidebar({
  title = "Learnly",
  logoHref = "/dashboard",
  navigation,
  footerCard,
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/30 transition-opacity lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out",
          isMobileOpen ? "visible translate-x-0" : "invisible -translate-x-full",
          isCollapsed
            ? "lg:invisible lg:-translate-x-full"
            : "lg:visible lg:translate-x-0",
        ].join(" ")}
      >
        <SidebarLogo title={title} href={logoHref} />

        <SidebarNavigation navigation={navigation} onNavigate={onMobileClose} />

        {footerCard && <SidebarFooterCard card={footerCard} />}
      </aside>
    </>
  );
}
