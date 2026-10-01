import {
  Award,
  Bell,
  BookOpen,
  Compass,
  Heart,
  LayoutDashboard,
  Settings,
  Trophy,
} from "lucide-react";

export const studentSidebarData = {
  navigation: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "my-learning",
      label: "My Learning",
      href: "/dashboard/my-learning",
      icon: BookOpen,
    },
    {
      id: "explore",
      label: "Explore",
      href: "/dashboard/explore",
      icon: Compass,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      href: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      id: "certificates",
      label: "Certificates",
      href: "/dashboard/certificates",
      icon: Award,
    },
    {
      id: "achievements",
      label: "Achievements",
      href: "/dashboard/achievements",
      icon: Trophy,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: 3,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],

  footerCard: {
    title: "Unlock more learning",
    description: "Get access to premium courses and advanced learning tools.",
    buttonText: "Upgrade to Pro",
  },
};
