type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="relative mb-12 border-b border-[#0B4650]/10 pb-10 md:mb-14 md:pb-12">
      <p className="mb-4 inline-flex w-fit items-center rounded-full border border-[#0B4650]/10 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/90 shadow-sm backdrop-blur-sm">
        {eyebrow}
      </p>
      <h1 className="font-display max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B4650] text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#0B4650]/70 text-pretty sm:text-lg">
        {description}
      </p>
    </header>
  );
}
