import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: SidebarItem[];
};

export type SidebarFooterCard = {
  title: string;
  description: string;
  buttonText?: string;
};

export type SidebarProps = {
  title?: string;
  logoHref?: string;
  navigation: SidebarItem[];
  footerCard?: SidebarFooterCard;
};
