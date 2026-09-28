import { Search } from "lucide-react";

type LessonSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function LessonSearch({ value, onChange }: LessonSearchProps) {
  return (
    <div className="relative mt-4">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search lessons..."
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}
