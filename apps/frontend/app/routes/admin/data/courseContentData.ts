// app/routes/admin/data/courseContentData.ts

import type { Section } from "../components/courses/content/types";

export const initialCourseSections: Section[] = [
  {
    id: 1,
    title: "Introduction to React",
    lessons: [
      {
        id: 1,
        title: "What is React?",
        description: "Introduction to React and its ecosystem.",
        type: "video",
        duration: "12 min",
        freePreview: true,
        downloadable: false,
      },
      {
        id: 2,
        title: "Setting Up Development Environment",
        description: "Install Node.js, VS Code and create a new project.",
        type: "article",
        duration: "10 min",
        freePreview: false,
        downloadable: true,
      },
      {
        id: 3,
        title: "Your First React Component",
        description: "Build your first component using functional components.",
        type: "code",
        duration: "23 min",
        freePreview: false,
        downloadable: false,
      },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    lessons: [
      {
        id: 4,
        title: "JSX Syntax",
        description: "Learn JSX syntax and writing expressions.",
        type: "video",
        duration: "15 min",
        freePreview: false,
        downloadable: false,
      },
      {
        id: 5,
        title: "Components and Props",
        description: "Understanding components and props in depth.",
        type: "article",
        duration: "20 min",
        freePreview: false,
        downloadable: true,
      },
      {
        id: 6,
        title: "State and Events",
        description: "Managing state and handling events.",
        type: "quiz",
        duration: "25 min",
        freePreview: false,
        downloadable: false,
      },
      {
        id: 7,
        title: "Conditional Rendering",
        description: "Learn conditional rendering techniques.",
        type: "code",
        duration: "20 min",
        freePreview: false,
        downloadable: false,
      },
    ],
  },
];
