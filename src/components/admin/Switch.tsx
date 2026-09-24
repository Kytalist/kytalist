"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group flex items-start gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4650]/30 disabled:opacity-60"
    >
      <span
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-[#0B4650]" : "bg-[#0B4650]/20"
        }`}
        aria-hidden
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#0B4650]">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs font-medium leading-relaxed text-[#0B4650]/55">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
