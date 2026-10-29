"use client";

import { useEffect, useId, useState } from "react";
import { Check, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { adminFormatListingDescription, adminGetAiQuota } from "@/lib/api/adminApi";
import type {
  AiQuotaResult,
  FormatDescriptionRequest,
  FormatDescriptionResult,
} from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";

type Props = {
  getToken: () => Promise<string | null>;
  fields: FormatDescriptionRequest;
  currentDescription: string;
  onApply: (markdown: string) => void;
};

const TEMPLATE_HINT = "Describe the program, who it's for";

function hasUsableDescription(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && !trimmed.includes(TEMPLATE_HINT);
}

export function AiDescriptionHelper({
  getToken,
  fields,
  currentDescription,
  onApply,
}: Props) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [useCurrentFields, setUseCurrentFields] = useState(true);
  const [improveExisting, setImproveExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FormatDescriptionResult | null>(null);
  const [quota, setQuota] = useState<AiQuotaResult | null>(null);

  const hasExisting = hasUsableDescription(currentDescription);
  const canGenerate =
    sourceText.trim().length > 0 || (improveExisting && hasExisting);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await adminGetAiQuota(token);
        if (!cancelled) setQuota(res.data);
      } catch {
        /* quota is optional; ignore failures */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  async function onGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const payload: FormatDescriptionRequest = {
        ...(useCurrentFields ? fields : {}),
        ...(sourceText.trim() ? { sourceText: sourceText.trim() } : {}),
        ...(improveExisting && hasExisting
          ? { currentDescription }
          : {}),
      };
      const response = await adminFormatListingDescription(token, payload);
      setResult(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not generate a description. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function onApplyResult(mode: "replace" | "append") {
    if (!result) return;
    const next =
      mode === "replace"
        ? result.markdown
        : [currentDescription.trim(), result.markdown.trim()]
            .filter(Boolean)
            .join("\n\n");
    onApply(next);
    setResult(null);
    setSourceText("");
    setError(null);
    setOpen(false);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-lg">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B4650]">
            <Sparkles className="h-4 w-4 text-[#F28F6B]" aria-hidden />
            AI description assistant
          </h3>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#0B4650]/60">
            Paste event details and AI will format them as Markdown without
            dropping any facts. Review the result before applying it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/20 bg-white/80 px-4 py-2 text-xs font-semibold text-[#0B4650] transition-colors hover:bg-white"
        >
          {open ? (
            <X className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          )}
          {open ? "Hide assistant" : "Draft with AI"}
        </button>
      </div>

      {open ? (
        <div
          id={panelId}
          className="space-y-4 border-t border-[#0B4650]/10 pt-4"
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Event details
            <textarea
              rows={8}
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              disabled={loading}
              placeholder="Paste the event description, eligibility, application steps, dates, fees, links, or flyer text…"
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3 text-sm font-medium leading-relaxed outline-none focus:border-[#0B4650]/30 disabled:opacity-60"
            />
          </label>

          <div className="space-y-2">
            <label className="flex items-start gap-3 text-xs font-semibold text-[#0B4650]">
              <input
                type="checkbox"
                checked={useCurrentFields}
                onChange={(event) => setUseCurrentFields(event.target.checked)}
                disabled={loading}
                className="mt-0.5 h-4 w-4 rounded border-[#0B4650]/20 text-[#0B4650]"
              />
              <span>
                Include the form fields above
                <span className="mt-0.5 block font-medium leading-relaxed text-[#0B4650]/55">
                  Sends the title, organization, location, category, deadline,
                  types, cost, and grades with your notes.
                </span>
              </span>
            </label>

            {hasExisting ? (
              <label className="flex items-start gap-3 text-xs font-semibold text-[#0B4650]">
                <input
                  type="checkbox"
                  checked={improveExisting}
                  onChange={(event) =>
                    setImproveExisting(event.target.checked)
                  }
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 rounded border-[#0B4650]/20 text-[#0B4650]"
                />
                <span>
                  Reformat the current description
                  <span className="mt-0.5 block font-medium leading-relaxed text-[#0B4650]/55">
                    Reformats the existing Markdown without dropping facts. Add
                    notes above to include new details.
                  </span>
                </span>
              </label>
            ) : null}
          </div>

          <p className="text-[11px] font-medium leading-relaxed text-[#0B4650]/50">
            The details you enter are sent to OpenRouter for formatting. Do not
            paste private or internal information.
          </p>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-[#B4532A]/30 bg-[#FFE4C4]/40 px-3 py-2 text-xs font-semibold text-[#B4532A]"
            >
              {error}
            </div>
          ) : null}

          {quota?.freeModelDaily ? (
            <p className="text-[11px] font-medium text-[#0B4650]/50">
              Free AI requests left today:{" "}
              <span className="font-semibold text-[#0B4650]">
                {quota.freeModelDaily.remaining}
              </span>{" "}
              of {quota.freeModelDaily.limit} (resets daily).
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onGenerate}
              disabled={loading || !canGenerate}
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
              )}
              {loading ? "Formatting…" : "Generate markdown"}
            </button>
            {result ? (
              <button
                type="button"
                onClick={() => setResult(null)}
                disabled={loading}
                className="text-xs font-semibold text-[#0B4650]/60 hover:text-[#0B4650] disabled:opacity-50"
              >
                Discard draft
              </button>
            ) : null}
          </div>

          {!canGenerate ? (
            <p className="text-[11px] font-medium text-[#0B4650]/50">
              Paste some event details or choose “Improve the current
              description” to continue.
            </p>
          ) : null}

          {result ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                    Preview
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#0B4650]/50">
                    Generated with {result.model}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4650]/60 hover:text-[#0B4650] disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Try again
                </button>
              </div>
              <div className="max-h-80 overflow-auto rounded-2xl border border-[#0B4650]/10 bg-[#F9F8F6] p-4">
                <Markdown content={result.markdown} />
              </div>

              {result.coverage.missing.length > 0 ? (
                <div
                  role="status"
                  className="rounded-xl border border-[#B4532A]/30 bg-[#FFE4C4]/40 px-3 py-2.5 text-xs font-semibold text-[#B4532A]"
                >
                  <p>
                    {result.coverage.missing.length} detail
                    {result.coverage.missing.length === 1 ? "" : "s"} from your
                    input aren’t in this draft:
                  </p>
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-5 font-medium">
                    {result.coverage.missing.map((item) => (
                      <li key={item} className="break-words">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 font-medium text-[#B4532A]/80">
                    Try again, or add them manually before applying.
                  </p>
                </div>
              ) : result.coverage.checked > 0 ? (
                <p className="text-[11px] font-medium text-[#0B4650]/55">
                  All {result.coverage.checked} dates, times, numbers, amounts,
                  links, and emails from your input appear in the draft.
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApplyResult("replace")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#062E35]"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Replace description
                </button>
                <button
                  type="button"
                  onClick={() => onApplyResult("append")}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/20 bg-white/80 px-4 py-2.5 text-xs font-semibold text-[#0B4650] transition-colors hover:bg-white"
                >
                  Append to description
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
