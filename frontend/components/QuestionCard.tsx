"use client";

export default function QuestionCard({ question, tags = [] }: { question: string; tags?: string[] }) {
  return (
    <div className="w-full max-w-[620px] rounded-2xl border border-slate-300/25 bg-gradient-to-r from-white/15 to-white/5 px-6 py-5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-7 md:py-6">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Current Question</p>
      <p className="text-lg font-semibold leading-relaxed text-slate-100 md:text-xl">{question}</p>
      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
