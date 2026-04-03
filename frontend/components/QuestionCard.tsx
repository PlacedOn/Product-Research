"use client";

export default function QuestionCard({ question, tags = [] }: { question: string; tags?: string[] }) {
  return (
    <div className="w-full max-w-[540px] rounded-xl border border-slate-400/30 bg-gradient-to-r from-white/15 to-white/5 px-6 py-5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <p className="text-xl font-semibold leading-relaxed text-slate-100">"{question}"</p>
      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-black/25 px-2 py-1 text-[11px] uppercase tracking-wider text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
