import { SidebarFooterCard } from "./SidebarFooter";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavigation } from "./SidebarNavigation";

import type { SidebarProps } from "./types";

export function Sidebar({
  title = "Learnly",
  logoHref = "/dashboard",
  navigation,
  footerCard,
}: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <SidebarLogo title={title} href={logoHref} />

      <SidebarNavigation navigation={navigation} />

      {footerCard && <SidebarFooterCard card={footerCard} />}
    </aside>
  );
}
