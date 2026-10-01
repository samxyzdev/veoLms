import {
  Archive,
  BarChart3,
  BookOpen,
  FileEdit,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";

export const courseCreatorSidebarData = {
  navigation: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/course-creator",
      icon: LayoutDashboard,
    },

    {
      id: "courses",
      label: "Courses",
      href: "/course-creator/courses",
      icon: BookOpen,

      children: [
        {
          id: "all-courses",
          label: "All Courses",
          href: "/course-creator/courses",
          icon: BookOpen,
        },
        {
          id: "new-course",
          label: "Create Course",
          href: "/course-creator/courses/new",
          icon: Plus,
        },
        {
          id: "draft-courses",
          label: "Drafts",
          href: "/course-creator/courses/drafts",
          icon: FileEdit,
        },
        {
          id: "archived-courses",
          label: "Archived",
          href: "/course-creator/courses/archived",
          icon: Archive,
        },
      ],
    },

    {
      id: "students",
      label: "Students",
      href: "/course-creator/students",
      icon: Users,
    },

    {
      id: "analytics",
      label: "Analytics",
      href: "/course-creator/analytics",
      icon: BarChart3,
    },

    {
      id: "settings",
      label: "Settings",
      href: "/course-creator/settings",
      icon: Settings,
    },
  ],

  footerCard: {
    title: "Grow your courses",
    description: "Track your courses, students, and teaching performance.",
  },
};
