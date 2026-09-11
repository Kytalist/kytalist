"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { joinWaitlist } from "@/lib/api/waitlist";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ComingSoonForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const result = await joinWaitlist(trimmed);
      setStatus("success");
      setMessage(
        result.status === "already-joined"
          ? "You're already on the list. We'll let you know when we launch!"
          : "You're on the list! We'll let you know when we launch.",
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      const fallback = "Something went wrong. Please try again.";
      if (err instanceof ApiError) {
        setMessage(err.message || fallback);
      } else {
        setMessage(fallback);
      }
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="w-full max-w-md">
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="card-surface squircle flex items-center gap-3 p-5"
        >
          <CheckCircle2
            className="h-6 w-6 shrink-0 text-[#0B8A6B]"
            aria-hidden
          />
          <p className="text-sm font-semibold text-[#0B4650]">{message}</p>
        </div>
      ) : (
        <form
          className="card-surface squircle flex w-full flex-col gap-2 p-1.5 sm:flex-row"
          onSubmit={onSubmit}
          noValidate
        >
          <label className="relative flex-1">
            <span className="sr-only">Email address</span>
            <Mail
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B4650]/40"
              aria-hidden
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              disabled={isSubmitting}
              placeholder="you@school.edu"
              className="h-12 w-full rounded-full bg-transparent pl-11 pr-4 text-sm font-medium text-[#0B4650] placeholder:text-[#0B4650]/40 outline-none disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B4650] px-6 text-sm font-semibold text-white transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Joining…" : "Notify me"}
            {!isSubmitting ? (
              <ArrowRight className="h-4 w-4" aria-hidden />
            ) : null}
          </button>
        </form>
      )}
      {status === "error" ? (
        <p
          role="alert"
          className="mt-3 text-center text-[12px] font-semibold text-[#B4532A]"
        >
          {message}
        </p>
      ) : (
        <p className="mt-3 text-center text-[11px] font-medium text-[#0B4650]/50">
          No spam. We&rsquo;ll only email you when we launch.
        </p>
      )}
    </div>
  );
}
