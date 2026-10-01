export type UserRole = "student" | "course_creator" | "admin";

export type HeaderUser = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
};

export type HeaderMode = "student" | "course_creator" | "admin";

export type HeaderProps = {
  user: HeaderUser;
  mode: HeaderMode;
  searchPlaceholder?: string;
};
