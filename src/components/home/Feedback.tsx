import { useRef, useState, type FormEvent } from "react";
import { Check, Globe, Lock, MailCheck, Send, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Where feedback is sent. Submitting opens the visitor's email app, addressed here. */
const FEEDBACK_EMAIL = "surya778055@gmail.com";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** The question, placeholder and sentence starters adapt to the rating given. */
function guidance(rating: number) {
  if (rating === 0) {
    return {
      question: "Start with a rating. It takes only a second.",
      placeholder: "Tell us about your commute with RideShare.",
      starters: ["The best part of my commute is", "Since using RideShare, I", "I would love it if"],
    };
  }
  if (rating <= 2) {
    return {
      question: "We are sorry it fell short. What went wrong?",
      placeholder: "Tell us what happened, and we will look into it.",
      starters: ["The problem I faced was", "It would have helped if", "I expected"],
    };
  }
  if (rating === 3) {
    return {
      question: "Thank you. What would make it excellent?",
      placeholder: "Tell us what works and what could be better.",
      starters: ["What works well is", "It would be better if", "I would use it more if"],
    };
  }
  return {
    question: "Wonderful. What do you enjoy most?",
    placeholder: "Tell us what makes RideShare work for you.",
    starters: ["The best part of my commute is", "I now save about ₹", "Travelling with colleagues means"],
  };
}

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  const shown = hover || rating;
  const g = guidance(rating);
  const steps = [
    { label: "Rate", done: rating > 0 },
    { label: "Share", done: message.trim().length >= 10 && name.trim().length > 0 },
    { label: "Send", done: sent },
  ];

  function addStarter(s: string) {
    const next = message.trim() ? `${message.trimEnd()} ${s} ` : `${s} `;
    setMessage(next);
    requestAnimationFrame(() => {
      const el = textRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(next.length, next.length);
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please choose a rating from one to five stars.");
      return;
    }
    const subject = `RideShare feedback: ${rating}/5 from ${name.trim()}`;
    const body = [
      `Rating: ${rating}/5 (${RATING_WORDS[rating]})`,
      `Name: ${name.trim()}`,
      `Role and campus: ${role.trim() || "Not provided"}`,
      "",
      message.trim(),
      "",
      consent
        ? "Permission: RideShare may publish this feedback with my name."
        : "Permission: Please do not publish this feedback.",
    ].join("\n");

    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setError("");
    setSent(true);
  }

  function reset() {
    setSent(false);
    setRating(0);
    setMessage("");
  }

  return (
    <section id="feedback" className="relative isolate overflow-hidden bg-cream py-section">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_28rem_at_12%_20%,rgba(251,146,60,0.16),transparent_65%),radial-gradient(36rem_26rem_at_95%_90%,rgba(244,114,182,0.12),transparent_65%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-wide items-start gap-12 px-gutter lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* The invitation, and a live preview of the visitor's words */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-accent">Your feedback</p>
            <h2 className="mt-4 text-title">
              Your commute, in your own <span className="font-accent text-accent">words</span>.
            </h2>
            <p className="mt-4 max-w-copy text-lead text-ink-soft">
              Every improvement to RideShare begins with a colleague who told us what would make
              the journey better. Share yours; it takes about a minute.
            </p>

            <FeedbackPreview
              rating={shown}
              name={name}
              role={role}
              message={message}
              consent={consent}
            />
          </div>
        </Reveal>

        {/* The form */}
        <Reveal delay={80}>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-40px_rgba(124,45,18,0.35)] ring-1 ring-[#f1e4d6] md:p-9">
            <ol className="flex items-center gap-2" aria-label="Progress">
              {steps.map((s, i) => (
                <li key={s.label} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-pill text-xs font-bold transition-colors duration-500",
                      s.done ? "bg-accent text-white" : "bg-[#f6ede4] text-[#9a3412]",
                    )}
                  >
                    {s.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="text-sm font-semibold text-ink">{s.label}</span>
                  {i < steps.length - 1 ? (
                    <span className="h-0.5 flex-1 overflow-hidden rounded-pill bg-[#f6ede4]" aria-hidden>
                      <span
                        className={cn(
                          "block h-full origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          s.done ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            {sent ? (
              <div className="animate-page-in py-12 text-center" aria-live="polite">
                <span className="mx-auto grid size-16 place-items-center rounded-pill bg-[#fff1e6] text-accent ring-8 ring-[#fff7f0]">
                  <MailCheck className="size-7" />
                </span>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
                  Thank you, {name.trim().split(" ")[0] || "colleague"}.
                </h3>
                <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink-soft">
                  Your email app should now be open with your feedback ready to send. If it did not
                  open, please write to us at{" "}
                  <a
                    href={`mailto:${FEEDBACK_EMAIL}`}
                    className="font-semibold text-accent underline underline-offset-4"
                  >
                    {FEEDBACK_EMAIL}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-7 min-h-11 rounded-pill px-6 text-sm font-semibold text-ink ring-1 ring-[#ead8c6] transition-colors hover:bg-[#fbf5ef]"
                >
                  Share more feedback
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 grid gap-6">
                {/* 1 · Rate */}
                <fieldset>
                  <legend className="text-lg font-bold tracking-tight text-ink">
                    How would you rate RideShare?
                  </legend>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex" onMouseLeave={() => setHover(0)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                          aria-pressed={rating === n}
                          onClick={() => {
                            setRating(n);
                            setError("");
                          }}
                          onMouseEnter={() => setHover(n)}
                          className="grid size-12 place-items-center rounded-2xl transition-colors hover:bg-[#fff4e8]"
                        >
                          <Star
                            className={cn(
                              "size-8 transition-[color,fill,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                              n <= shown ? "scale-110 fill-[#f59e0b] text-[#f59e0b]" : "text-[#e3d3c3]",
                            )}
                            strokeWidth={1.6}
                          />
                        </button>
                      ))}
                    </div>
                    <span
                      key={shown}
                      className={cn(
                        "min-w-20 animate-page-in rounded-pill px-3 py-1 text-sm font-semibold",
                        shown ? "bg-[#fff4e8] text-[#9a3412]" : "text-muted",
                      )}
                      aria-live="polite"
                    >
                      {RATING_WORDS[shown] || "Tap a star"}
                    </span>
                  </div>
                  {error ? <p className="mt-2 text-sm font-medium text-[#b91c1c]">{error}</p> : null}
                </fieldset>

                {/* 2 · Share */}
                <div>
                  <p key={g.question} className="animate-page-in text-lg font-bold tracking-tight text-ink">
                    {g.question}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.starters.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addStarter(s)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-pill bg-[#fbf5ef] px-3.5 text-sm text-ink-soft ring-1 ring-[#efe0d0] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#fff1e6] hover:text-[#9a3412]"
                      >
                        <Sparkles className="size-3.5 text-[#ea580c]" />
                        {s}…
                      </button>
                    ))}
                  </div>
                  <label className="mt-3 block">
                    <span className="sr-only">Your feedback</span>
                    <textarea
                      ref={textRef}
                      name="message"
                      rows={5}
                      required
                      maxLength={600}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={g.placeholder}
                      className="block w-full resize-none rounded-2xl bg-[#fbf7f3] px-4 py-3.5 leading-relaxed text-ink ring-1 ring-[#efe0d0] transition-shadow outline-none placeholder:text-[#a8998b] focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                    />
                  </label>
                  <p className="mt-1.5 text-right text-xs text-muted tabular-nums">{message.length} / 600</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name" value={name} onChange={setName} autoComplete="name" required />
                  <Field
                    label="Role and campus"
                    value={role}
                    onChange={setRole}
                    placeholder="e.g. Engineer, Gachibowli"
                    optional
                  />
                </div>

                {/* Publishing preference */}
                <div role="radiogroup" aria-label="Publishing preference" className="grid gap-2 sm:grid-cols-2">
                  {[
                    { on: true, icon: Globe, title: "Feature my words", note: "Shown on this site with your name" },
                    { on: false, icon: Lock, title: "Keep it private", note: "Read only by the RideShare team" },
                  ].map((o) => (
                    <button
                      key={o.title}
                      type="button"
                      role="radio"
                      aria-checked={consent === o.on}
                      onClick={() => setConsent(o.on)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl p-3.5 text-left ring-1 transition-[background-color,box-shadow] duration-300",
                        consent === o.on
                          ? "bg-[#fff4e8] ring-2 ring-[#ea580c]"
                          : "bg-white ring-[#efe0d0] hover:bg-[#fbf7f3]",
                      )}
                    >
                      <o.icon
                        className={cn("mt-0.5 size-4 shrink-0", consent === o.on ? "text-accent" : "text-muted")}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{o.title}</span>
                        <span className="block text-xs text-muted">{o.note}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* 3 · Send */}
                <button
                  type="submit"
                  className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-pill bg-[#1c1917] px-6 font-semibold text-white shadow-[0_18px_40px_-18px_rgba(28,25,23,0.7)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent"
                >
                  Send my feedback
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </button>
                <p className="-mt-2 text-center text-xs text-muted">
                  Sending opens your email app with everything ready. Nothing is sent without your
                  confirmation.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeedbackPreview({
  rating,
  name,
  role,
  message,
  consent,
}: {
  rating: number;
  name: string;
  role: string;
  message: string;
  consent: boolean;
}) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "You";
  const text = message.trim();

  return (
    <figure className="relative mt-10 max-w-lg" aria-label="Preview of your feedback">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-[#9a3412] uppercase">
        <span className="size-1.5 animate-pulse rounded-pill bg-[#ea580c]" />
        Live preview
      </p>
      <div className="relative -rotate-1 rounded-[1.75rem] bg-[#1c1917] p-7 text-on-dark shadow-[0_40px_80px_-35px_rgba(28,25,23,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-0">
        <span
          className="pointer-events-none absolute -top-6 right-6 font-accent text-[7rem] leading-none text-[#fbbf24]/25 select-none"
          aria-hidden
        >
          &ldquo;
        </span>
        <div className="flex gap-1" aria-label={rating ? `${rating} out of 5 stars` : "No rating yet"}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn(
                "size-4 transition-colors duration-300",
                n <= rating ? "fill-[#fbbf24] text-[#fbbf24]" : "text-white/20",
              )}
            />
          ))}
        </div>
        <blockquote className="mt-4 min-h-[5.5rem] font-accent text-2xl leading-snug md:text-[1.7rem]">
          {text ? (
            <span className="break-words">{text}</span>
          ) : (
            <span className="text-white/35">
              Your words will appear here as you type
              <span className="ml-0.5 inline-block h-6 w-0.5 translate-y-1 animate-pulse bg-[#fbbf24]" />
            </span>
          )}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-pill bg-linear-to-br from-[#fb923c] to-[#db2777] text-sm font-bold">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{name.trim() || "Your name"}</span>
            <span className="block truncate text-sm text-on-dark/55">{role.trim() || "Your role and campus"}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold text-on-dark/75">
            {consent ? <Globe className="size-3" /> : <Lock className="size-3" />}
            {consent ? "Public" : "Private"}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

function Field({
  label,
  value,
  onChange,
  optional = false,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-2xl bg-[#fbf7f3] px-4 text-ink ring-1 ring-[#efe0d0] transition-shadow outline-none placeholder:text-[#a8998b] focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
      />
    </label>
  );
}
