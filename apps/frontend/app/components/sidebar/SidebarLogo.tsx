import { BookOpen } from "lucide-react";
import { NavLink } from "react-router";

type SidebarLogoProps = {
  title?: string;
  href?: string;
};

export function SidebarLogo({
  title = "Learnly",
  href = "/dashboard",
}: SidebarLogoProps) {
  return (
    <div className="flex h-[76px] items-center border-b border-slate-100 px-5">
      <NavLink to={href} className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <BookOpen size={20} />
        </div>

        <span className="text-xl font-extrabold tracking-tight text-slate-950">
          {title}
        </span>
      </NavLink>
    </div>
  );
}
