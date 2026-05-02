import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#0B4650]/10 bg-white/40 py-12 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-4 text-center text-sm text-[#0B4650]/60 sm:flex-row sm:text-left sm:px-6">
        <div className="flex items-center gap-2 font-display font-bold text-[#0B4650]">
          <Sparkles className="h-5 w-5 text-[#F28F6B]" aria-hidden />
          Kytalist
        </div>
        <p>Demo content for exploration—verify details with each program.</p>
      </div>
    </footer>
  );
}
