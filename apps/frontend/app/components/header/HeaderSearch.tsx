import { Search } from "lucide-react";

type HeaderSearchProps = {
  placeholder?: string;
};

export function HeaderSearch({
  placeholder = "Search courses, lessons...",
}: HeaderSearchProps) {
  return (
    <div className="hidden max-w-md flex-1 md:flex">
      <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
        <Search size={17} className="shrink-0 text-slate-400" />

        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400 xl:block">
          ⌘ K
        </kbd>
      </div>
    </div>
  );
}
