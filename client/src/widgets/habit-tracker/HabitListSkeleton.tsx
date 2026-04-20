export const HabitListSkeleton = () => {
  return (
    <section className="glass-panel rounded-[2rem] border border-white/80 p-6 shadow-panel sm:p-7">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-3 w-36 animate-pulse rounded-full bg-white/70" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-white/70" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-full bg-white/70" />
      </div>
      <div className="mb-8 h-14 animate-pulse rounded-[1.4rem] bg-white/70" />
      <div className="space-y-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft">
            <div className="h-3 w-20 animate-pulse rounded-full bg-surface" />
            <div className="mt-4 h-7 w-48 animate-pulse rounded-full bg-surface" />
            <div className="mt-6 flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div key={day} className="h-6 w-6 animate-pulse rounded-full bg-surface" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
