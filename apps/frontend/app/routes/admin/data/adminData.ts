// app/routes/admin/data/adminData.ts

export const adminData = {
  admin: {
    name: "Admin",
    avatar: "AS",
  },

  stats: [
    {
      id: 1,
      title: "Total Students",
      value: "1,248",
      change: "+12%",
      description: "from last month",
      icon: "Users",
      color: "purple",
    },
    {
      id: 2,
      title: "Total Courses",
      value: "86",
      change: "+8%",
      description: "from last month",
      icon: "BookOpen",
      color: "blue",
    },
    {
      id: 3,
      title: "Total Enrollments",
      value: "3,621",
      change: "+18%",
      description: "from last month",
      icon: "GraduationCap",
      color: "green",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: "$12,480",
      change: "+24%",
      description: "from last month",
      icon: "CircleDollarSign",
      color: "orange",
    },
  ],

  enrollmentOverview: [
    {
      month: "Apr",
      value: 320,
    },
    {
      month: "May",
      value: 450,
    },
    {
      month: "Jun",
      value: 520,
    },
    {
      month: "Jul",
      value: 610,
    },
    {
      month: "Aug",
      value: 680,
    },
    {
      month: "Sep",
      value: 720,
    },
  ],

  popularCourses: [
    {
      id: 1,
      rank: 1,
      title: "React for Beginners",
      students: "320 students",
      rating: 4.9,
      enrollments: "1.2k",
      progress: 58,
      thumbnail: "react",
    },
    {
      id: 2,
      rank: 2,
      title: "Node.js for Beginners",
      students: "280 students",
      rating: 4.8,
      enrollments: "980",
      progress: 72,
      thumbnail: "node",
    },
    {
      id: 3,
      rank: 3,
      title: "HTML & CSS Fundamentals",
      students: "250 students",
      rating: 4.7,
      enrollments: "860",
      progress: 64,
      thumbnail: "html",
    },
    {
      id: 4,
      rank: 4,
      title: "TypeScript Masterclass",
      students: "210 students",
      rating: 4.8,
      enrollments: "720",
      progress: 48,
      thumbnail: "typescript",
    },
  ],

  recentEnrollments: [
    {
      id: 1,
      student: "John Smith",
      email: "john@example.com",
      initials: "JS",
      course: "React for Beginners",
      date: "Sep 14, 2026",
      status: "Enrolled",
    },
    {
      id: 2,
      student: "Emma Roberts",
      email: "emma@example.com",
      initials: "ER",
      course: "Node.js for Beginners",
      date: "Sep 14, 2026",
      status: "Enrolled",
    },
    {
      id: 3,
      student: "Michael Johnson",
      email: "michael@example.com",
      initials: "MJ",
      course: "UI/UX Design Fundamentals",
      date: "Sep 13, 2026",
      status: "Enrolled",
    },
    {
      id: 4,
      student: "Sophia Patel",
      email: "sophia@example.com",
      initials: "SP",
      course: "TypeScript Masterclass",
      date: "Sep 13, 2026",
      status: "Enrolled",
    },
    {
      id: 5,
      student: "Daniel Lee",
      email: "daniel@example.com",
      initials: "DL",
      course: "HTML & CSS Fundamentals",
      date: "Sep 12, 2026",
      status: "Enrolled",
    },
  ],

  studentGrowth: [
    {
      month: "Apr",
      value: 320,
    },
    {
      month: "May",
      value: 510,
    },
    {
      month: "Jun",
      value: 710,
    },
    {
      month: "Jul",
      value: 1020,
    },
    {
      month: "Aug",
      value: 1090,
    },
    {
      month: "Sep",
      value: 1248,
    },
  ],

  studentGrowthSummary: [
    {
      id: 1,
      title: "New Students",
      value: "320",
      change: "+15%",
      icon: "UserPlus",
    },
    {
      id: 2,
      title: "Active Students",
      value: "1,020",
      change: "+10%",
      icon: "Users",
    },
  ],

  courseCategories: [
    {
      id: 1,
      name: "Development",
      courses: 32,
      percentage: 37,
      color: "bg-indigo-500",
    },
    {
      id: 2,
      name: "Design",
      courses: 18,
      percentage: 21,
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "Business",
      courses: 12,
      percentage: 14,
      color: "bg-emerald-400",
    },
    {
      id: 4,
      name: "Marketing",
      courses: 10,
      percentage: 12,
      color: "bg-orange-400",
    },
    {
      id: 5,
      name: "Data Science",
      courses: 8,
      percentage: 9,
      color: "bg-pink-400",
    },
    {
      id: 6,
      name: "Others",
      courses: 6,
      percentage: 7,
      color: "bg-slate-300",
    },
  ],

  settings: {
    sidebar: [
      {
        id: "profile",
        label: "Profile",
        description: "Manage your admin profile",
        icon: "UserRound",
        group: "Account",
      },
      {
        id: "security",
        label: "Security",
        description: "Password and security",
        icon: "Shield",
        group: "Account",
      },

      {
        id: "general",
        label: "General",
        description: "Platform information",
        icon: "Settings",
        group: "Platform",
      },
      {
        id: "courses",
        label: "Course Settings",
        description: "Course defaults and rules",
        icon: "BookOpen",
        group: "Platform",
      },
      {
        id: "enrollments",
        label: "Enrollment Settings",
        description: "Enrollment and access",
        icon: "ClipboardList",
        group: "Platform",
      },
      {
        id: "payments",
        label: "Payment Settings",
        description: "Payments and pricing",
        icon: "CreditCard",
        group: "Platform",
      },
      {
        id: "certificates",
        label: "Certificate Settings",
        description: "Certificates and completion",
        icon: "Award",
        group: "Platform",
      },

      {
        id: "roles",
        label: "Roles & Permissions",
        description: "Manage access levels",
        icon: "UsersRound",
        group: "Users & Access",
      },
      {
        id: "instructors",
        label: "Instructor Settings",
        description: "Instructor configuration",
        icon: "UserRound",
        group: "Users & Access",
      },
      {
        id: "students",
        label: "Student Settings",
        description: "Student configuration",
        icon: "GraduationCap",
        group: "Users & Access",
      },

      {
        id: "email",
        label: "Email Settings",
        description: "Configure email delivery",
        icon: "Mail",
        group: "Communication",
      },
      {
        id: "notifications",
        label: "Notification Settings",
        description: "Platform notifications",
        icon: "Bell",
        group: "Communication",
      },
      {
        id: "announcements",
        label: "Announcement Settings",
        description: "Manage announcements",
        icon: "Megaphone",
        group: "Communication",
      },

      {
        id: "storage",
        label: "Storage",
        description: "Files and media storage",
        icon: "HardDrive",
        group: "System",
      },
      {
        id: "integrations",
        label: "Integrations",
        description: "Third-party services",
        icon: "Link2",
        group: "System",
      },
      {
        id: "privacy",
        label: "Security & Privacy",
        description: "Privacy and security controls",
        icon: "ShieldCheck",
        group: "System",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        description: "System maintenance",
        icon: "Wrench",
        group: "System",
      },
    ],

    general: {
      platformName: "Learnly",
      tagline: "Learn. Practice. Grow.",
      siteUrl: "https://learnly.com",
      timezone: "(GMT+5:30) Asia/Kolkata",
      language: "English",

      logo: {
        text: "L",
      },

      appearance: {
        primaryColor: "#6366F1",
        secondaryColor: "#3B82F6",
        theme: "light",
      },

      features: [
        {
          id: 1,
          title: "User Registration",
          description: "Allow new users to register on the platform.",
          enabled: true,
          icon: "UserPlus",
        },
        {
          id: 2,
          title: "Course Reviews",
          description: "Allow students to leave reviews on courses.",
          enabled: true,
          icon: "Star",
        },
        {
          id: 3,
          title: "Discussion Forums",
          description: "Enable course discussion and community forums.",
          enabled: false,
          icon: "MessageCircle",
        },
        {
          id: 4,
          title: "Live Classes",
          description: "Enable live class functionality for instructors.",
          enabled: true,
          icon: "Video",
        },
        {
          id: 5,
          title: "Certificates",
          description: "Allow issuing certificates upon course completion.",
          enabled: true,
          icon: "Award",
        },
        {
          id: 6,
          title: "Assignments",
          description: "Enable assignment submissions and grading.",
          enabled: false,
          icon: "ClipboardList",
        },
      ],
    },

    courses: {
      defaultVisibility: "Draft",
      defaultLevel: "Beginner",
      allowPreview: true,
      allowReviews: true,
      requireApproval: true,
      enableComments: true,
    },

    enrollments: {
      allowEnrollment: true,
      autoApprove: true,
      allowGuestEnrollment: false,
      maxStudentsPerCourse: 100,
      allowSelfUnenroll: true,
    },

    payments: {
      currency: "USD",
      paymentProvider: "Stripe",
      taxEnabled: true,
      couponEnabled: true,
      refundWindow: "14 days",
    },

    certificates: {
      enabled: true,
      autoIssue: true,
      requireCompletion: true,
      includeInstructor: true,
      includeCertificateId: true,
    },

    roles: [
      {
        id: 1,
        name: "Admin",
        description: "Full platform access",
        users: 3,
        permissions: "All Permissions",
      },
      {
        id: 2,
        name: "Instructor",
        description: "Create and manage courses",
        users: 24,
        permissions: "Course Management",
      },
      {
        id: 3,
        name: "Student",
        description: "Access enrolled courses",
        users: 1248,
        permissions: "Learning Access",
      },
    ],

    notifications: [
      {
        id: 1,
        title: "New Enrollment",
        description: "Notify admins when a student enrolls.",
        enabled: true,
      },
      {
        id: 2,
        title: "New Course Published",
        description: "Notify admins when an instructor publishes a course.",
        enabled: true,
      },
      {
        id: 3,
        title: "New Review",
        description: "Notify admins when a student posts a review.",
        enabled: true,
      },
      {
        id: 4,
        title: "Payment Failed",
        description: "Notify admins about failed transactions.",
        enabled: true,
      },
    ],

    integrations: [
      {
        id: 1,
        name: "Stripe",
        description: "Online payments",
        connected: true,
      },
      {
        id: 2,
        name: "Google Analytics",
        description: "Website analytics",
        connected: true,
      },
      {
        id: 3,
        name: "Cloudflare R2",
        description: "Video and file storage",
        connected: false,
      },
      {
        id: 4,
        name: "Google OAuth",
        description: "Social authentication",
        connected: true,
      },
    ],
  },
};
