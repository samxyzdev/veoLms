// app/routes/dashboard/data/dashboardData.ts

export const dashboardData = {
  user: {
    name: "John",
    avatar: "JS",
  },

  dateRange: {
    label: "Sep 2026",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
  },

  stats: [
    {
      id: 1,
      title: "Enrolled Courses",
      value: "12",
      change: "+2",
      description: "from last month",
      icon: "BookOpen",
      iconStyle: "purple",
    },
    {
      id: 2,
      title: "Completed Courses",
      value: "3",
      change: "+1",
      description: "from last month",
      icon: "CircleCheck",
      iconStyle: "green",
    },
    {
      id: 3,
      title: "Lessons Completed",
      value: "48",
      change: "+12",
      description: "from last month",
      icon: "PlayCircle",
      iconStyle: "blue",
    },
    {
      id: 4,
      title: "Learning Streak",
      value: "7 days",
      description: "Keep it up!",
      icon: "Flame",
      iconStyle: "orange",
    },
  ],

  enrollment: [
    {
      month: "Jan",
      enrolled: 38,
    },
    {
      month: "Feb",
      enrolled: 52,
    },
    {
      month: "Mar",
      enrolled: 46,
    },
    {
      month: "Apr",
      enrolled: 68,
    },
    {
      month: "May",
      enrolled: 62,
    },
    {
      month: "Jun",
      enrolled: 84,
    },
    {
      month: "Jul",
      enrolled: 76,
    },
    {
      month: "Aug",
      enrolled: 94,
    },
    {
      month: "Sep",
      enrolled: 108,
    },
  ],

  continueLearning: {
    course: "React for Beginners",
    section: "Section 4: Components and Props",
    completedLessons: 8,
    totalLessons: 12,
    progress: 65,
  },

  deadlines: [
    {
      id: 1,
      month: "SEP",
      day: "14",
      title: "React Components Quiz",
      course: "React for Beginners",
      daysLeft: "3 days left",
    },
    {
      id: 2,
      month: "SEP",
      day: "18",
      title: "Build a REST API Project",
      course: "Node.js for Beginners",
      daysLeft: "7 days left",
    },
    {
      id: 3,
      month: "SEP",
      day: "25",
      title: "Final Assessment",
      course: "HTML & CSS Fundamentals",
      daysLeft: "14 days left",
    },
  ],

  courseProgress: [
    {
      id: 1,
      title: "React for Beginners",
      completed: "8 of 12 lessons",
      progress: 65,
      type: "react",
    },
    {
      id: 2,
      title: "Node.js for Beginners",
      completed: "6 of 10 lessons",
      progress: 60,
      type: "node",
    },
    {
      id: 3,
      title: "HTML & CSS Fundamentals",
      completed: "9 of 10 lessons",
      progress: 90,
      type: "html",
    },
    {
      id: 4,
      title: "TypeScript Masterclass",
      completed: "3 of 14 lessons",
      progress: 21,
      type: "typescript",
    },
  ],

  recentActivity: [
    {
      id: 1,
      title: "Watched a lesson",
      description: "State Management in React",
      time: "2 hours ago",
      icon: "Play",
      style: "purple",
    },
    {
      id: 2,
      title: "Completed quiz",
      description: "JavaScript Basics Quiz",
      time: "4 hours ago",
      icon: "FileText",
      style: "blue",
    },
    {
      id: 3,
      title: "Submitted assignment",
      description: "Build a Simple API",
      time: "1 day ago",
      icon: "CircleCheck",
      style: "green",
    },
    {
      id: 4,
      title: "Added a course to wishlist",
      description: "TypeScript Masterclass",
      time: "2 days ago",
      icon: "Bookmark",
      style: "orange",
    },
  ],

  recommendedCourses: [
    {
      id: 1,
      title: "Advanced React",
      category: "React",
      duration: "6h 30m",
      rating: "4.9",
      students: "12k",
      type: "react",
    },
    {
      id: 2,
      title: "Node.js Backend",
      category: "Node.js",
      duration: "8h 15m",
      rating: "4.8",
      students: "9.8k",
      type: "node",
    },
    {
      id: 3,
      title: "TypeScript Masterclass",
      category: "TypeScript",
      duration: "10h 20m",
      rating: "4.9",
      students: "8.2k",
      type: "typescript",
    },
    {
      id: 4,
      title: "UI/UX Design",
      category: "Design",
      duration: "5h 40m",
      rating: "4.7",
      students: "6.4k",
      type: "design",
    },
  ],

  weeklyGoal: {
    completed: 6,
    target: 8,
    label: "Complete 8 lessons this week",
  },

  navigation: [
    {
      id: 1,
      label: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      id: 2,
      label: "My Learning",
      href: "/dashboard/my-learning",
      icon: "BookOpen",
    },
    {
      id: 3,
      label: "Explore Courses",
      href: "/dashboard/explore-courses",
      icon: "Compass",
    },
    {
      id: 4,
      label: "Wishlist",
      href: "/dashboard/wishlist",
      icon: "Heart",
    },
    {
      id: 5,
      label: "Certificates",
      href: "/dashboard/certificates",
      icon: "Award",
    },
    {
      id: 6,
      label: "Achievements",
      href: "/dashboard/achievements",
      icon: "Trophy",
    },
    {
      id: 7,
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: "Bell",
    },
    {
      id: 8,
      label: "Settings",
      href: "/dashboard/settings",
      icon: "Settings",
    },
  ],
  myLearning: {
    tabs: [
      {
        id: "all",
        label: "Purchased Courses",
      },
      {
        id: "in-progress",
        label: "In Progress",
      },
      {
        id: "completed",
        label: "Completed",
      },
      {
        id: "not-started",
        label: "Not Started",
      },
    ],

    courses: [
      {
        id: 1,
        title: "React for Beginners",
        description: "Learn React from scratch with hands-on projects.",
        instructor: "John Smith",
        lessons: 12,
        completedLessons: 8,
        duration: "6h 30m",
        level: "Beginner",
        category: "Development",
        progress: 65,
        status: "in-progress",
        thumbnail: "react",
        nextLesson: "Components and Props",
      },

      {
        id: 2,
        title: "Node.js for Beginners",
        description: "Build backend applications with Node.js and Express.",
        instructor: "David Wilson",
        lessons: 10,
        completedLessons: 6,
        duration: "8h 15m",
        level: "Beginner",
        category: "Backend",
        progress: 60,
        status: "in-progress",
        thumbnail: "node",
        nextLesson: "Building REST APIs",
      },

      {
        id: 3,
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of modern web development.",
        instructor: "Sarah Miller",
        lessons: 10,
        completedLessons: 10,
        duration: "5h 20m",
        level: "Beginner",
        category: "Web Design",
        progress: 100,
        status: "completed",
        thumbnail: "html",
        nextLesson: "Responsive Design",
      },

      {
        id: 4,
        title: "TypeScript Masterclass",
        description: "Master TypeScript with real-world examples.",
        instructor: "Alex Johnson",
        lessons: 14,
        completedLessons: 3,
        duration: "10h 20m",
        level: "Intermediate",
        category: "Development",
        progress: 21,
        status: "in-progress",
        thumbnail: "typescript",
        nextLesson: "Generic Types",
      },

      {
        id: 5,
        title: "Next.js Full Stack",
        description: "Build full-stack applications with Next.js.",
        instructor: "Michael Brown",
        lessons: 18,
        completedLessons: 0,
        duration: "12h 10m",
        level: "Intermediate",
        category: "Development",
        progress: 0,
        status: "not-started",
        thumbnail: "nextjs",
        nextLesson: "Introduction",
      },

      {
        id: 6,
        title: "UI/UX Design Fundamentals",
        description:
          "Learn UI/UX design principles and create stunning interfaces.",
        instructor: "Emma Davis",
        lessons: 15,
        completedLessons: 0,
        duration: "7h 40m",
        level: "Beginner",
        category: "Design",
        progress: 0,
        status: "not-started",
        thumbnail: "design",
        nextLesson: "Design Principles",
      },
    ],
  },
  explore: {
    hero: {
      badge: "Start Learning Today",
      title: "Learn Without Limits",
      description:
        "Access 500+ courses from industry experts and build skills for your future.",
      buttonText: "Browse All Courses",
    },

    categories: [
      {
        id: "all",
        label: "All",
        icon: "LayoutGrid",
      },
      {
        id: "development",
        label: "Development",
        icon: "Code2",
      },
      {
        id: "design",
        label: "Design",
        icon: "Palette",
      },
      {
        id: "business",
        label: "Business",
        icon: "BriefcaseBusiness",
      },
      {
        id: "marketing",
        label: "Marketing",
        icon: "Megaphone",
      },
      {
        id: "data-science",
        label: "Data Science",
        icon: "Database",
      },
      {
        id: "personal-development",
        label: "Personal Development",
        icon: "UserRound",
      },
      {
        id: "tools",
        label: "Tools",
        icon: "Wrench",
      },
    ],

    courses: [
      {
        id: 1,
        title: "React for Beginners",
        description: "Learn React from scratch with hands-on projects.",
        instructor: "John Smith",
        category: "Development",
        categoryId: "development",
        level: "Beginner",
        duration: "6h 30m",
        rating: 4.9,
        students: "12k",
        badge: "Best Seller",
        thumbnail: "react",
      },

      {
        id: 2,
        title: "Node.js for Beginners",
        description: "Build backend applications with Node.js and Express.",
        instructor: "David Wilson",
        category: "Development",
        categoryId: "development",
        level: "Beginner",
        duration: "8h 15m",
        rating: 4.8,
        students: "9.8k",
        badge: "Most Popular",
        thumbnail: "node",
      },

      {
        id: 3,
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of modern web development.",
        instructor: "Sarah Miller",
        category: "Web Design",
        categoryId: "design",
        level: "Beginner",
        duration: "5h 20m",
        rating: 4.7,
        students: "15k",
        badge: null,
        thumbnail: "html",
      },

      {
        id: 4,
        title: "TypeScript Masterclass",
        description: "Master TypeScript with real-world examples.",
        instructor: "Alex Johnson",
        category: "Development",
        categoryId: "development",
        level: "Intermediate",
        duration: "10h 20m",
        rating: 4.8,
        students: "8.2k",
        badge: "Trending",
        thumbnail: "typescript",
      },

      {
        id: 5,
        title: "Next.js Full Stack",
        description: "Build full-stack applications with Next.js.",
        instructor: "Michael Brown",
        category: "Development",
        categoryId: "development",
        level: "Intermediate",
        duration: "12h 10m",
        rating: 4.9,
        students: "6.5k",
        badge: null,
        thumbnail: "nextjs",
      },

      {
        id: 6,
        title: "UI/UX Design Fundamentals",
        description:
          "Learn UI/UX design principles and create stunning interfaces.",
        instructor: "Emma Davis",
        category: "Design",
        categoryId: "design",
        level: "Beginner",
        duration: "7h 40m",
        rating: 4.7,
        students: "4.6k",
        badge: "New",
        thumbnail: "design",
      },

      {
        id: 7,
        title: "JavaScript Advanced",
        description: "Take your JavaScript skills to the next level.",
        instructor: "Daniel Lee",
        category: "Development",
        categoryId: "development",
        level: "Advanced",
        duration: "11h 50m",
        rating: 4.8,
        students: "7.1k",
        badge: null,
        thumbnail: "javascript",
      },

      {
        id: 8,
        title: "Git & GitHub",
        description: "Master version control with Git and GitHub.",
        instructor: "Chris Taylor",
        category: "Tools",
        categoryId: "tools",
        level: "Beginner",
        duration: "3h 45m",
        rating: 4.6,
        students: "5.9k",
        badge: null,
        thumbnail: "git",
      },
    ],

    filters: {
      levels: ["All Levels", "Beginner", "Intermediate", "Advanced"],

      durations: ["Any Duration", "0 - 5 Hours", "5 - 10 Hours", "10+ Hours"],

      ratings: ["Any Rating", "4.5+", "4.0+", "3.5+"],

      sortOptions: [
        {
          value: "popular",
          label: "Popular",
        },
        {
          value: "rating",
          label: "Highest Rated",
        },
        {
          value: "newest",
          label: "Newest",
        },
        {
          value: "students",
          label: "Most Enrolled",
        },
      ],
    },
  },
  settings: {
    sidebar: [
      {
        id: "profile",
        label: "Profile Information",
        description: "Update your personal details",
        icon: "UserRound",
        group: "Account",
      },
      {
        id: "security",
        label: "Account Security",
        description: "Password and security settings",
        icon: "Shield",
        group: "Account",
      },
      {
        id: "learning",
        label: "Learning Preferences",
        description: "Customize your learning experience",
        icon: "SlidersHorizontal",
        group: "Learning",
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Manage your notification preferences",
        icon: "Bell",
        group: "Learning",
      },
      {
        id: "appearance",
        label: "Appearance",
        description: "Theme and display settings",
        icon: "Palette",
        group: "Learning",
      },
      {
        id: "language",
        label: "Language",
        description: "Choose your preferred language",
        icon: "Globe",
        group: "Learning",
      },
      {
        id: "privacy",
        label: "Privacy & Data",
        description: "Manage your privacy settings",
        icon: "Lock",
        group: "Privacy",
      },
      {
        id: "support",
        label: "Help & Support",
        description: "Get help and contact support",
        icon: "CircleHelp",
        group: "Privacy",
      },
    ],

    profile: {
      name: "John Smith",
      email: "john@example.com",
      bio: "Passionate learner exploring web development, design, and new technologies. Always excited to learn something new!",
      avatar: "JS",
      maxBioLength: 200,
    },

    learningPreferences: {
      learningGoal: "Build a career in Web Development",
      skillLevel: "Beginner",
      language: "English",

      interests: [
        "React",
        "JavaScript",
        "UI/UX Design",
        "Node.js",
        "TypeScript",
      ],
    },

    notifications: [
      {
        id: 1,
        title: "Course updates",
        description: "New lessons, assignments and announcements",
        enabled: true,
        icon: "Bell",
      },
      {
        id: 2,
        title: "Marketing emails",
        description: "Tips, new courses and special offers",
        enabled: false,
        icon: "Mail",
      },
      {
        id: 3,
        title: "Achievement alerts",
        description: "Get notified when you complete milestones",
        enabled: true,
        icon: "Award",
      },
    ],

    appearance: {
      theme: "light",
      accentColor: "indigo",
    },
  },
};
