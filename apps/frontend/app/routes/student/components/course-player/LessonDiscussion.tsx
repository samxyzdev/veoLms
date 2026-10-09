import { ChevronDown, ListFilter, MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export type LessonComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

type LessonDiscussionProps = {
  comments?: LessonComment[];
  onAddComment?: (body: string) => void;
};

export function LessonDiscussion({ comments = [], onAddComment }: LessonDiscussionProps) {
  const [draft, setDraft] = useState("");
  const canComment = Boolean(onAddComment);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !onAddComment) return;
    onAddComment(body);
    setDraft("");
  }

  return (
    <section className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-slate-950">{comments.length} Comments</h2>
        <button type="button" className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500"><ListFilter size={13} />Sort by: <span className="font-bold text-slate-700">Newest</span><ChevronDown size={12} /></button>
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">ME</div>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!canComment}
          placeholder={canComment ? "Add a comment..." : "Discussion is not available for this lesson yet"}
          className="h-8 min-w-0 flex-1 bg-transparent px-1 text-xs text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
        <button type="submit" disabled={!canComment || !draft.trim()} aria-label="Post comment" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><Send size={14} /></button>
      </form>

      {comments.length > 0 ? (
        <div className="mt-2 divide-y divide-slate-200">
          {comments.map((comment) => (
            <article key={comment.id} className="flex gap-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">{comment.author.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-800">{comment.author} <span className="ml-1 font-normal text-slate-400">{comment.createdAt}</span></p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{comment.body}</p>
              </div>
              <MessageCircle size={15} className="mt-1 shrink-0 text-slate-400" />
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-2 px-1 text-[10px] text-slate-400">Questions and lesson discussion will show here.</p>
      )}
    </section>
  );
}
