import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, CheckCircle2, Mic, PlayCircle, Quote, ShieldCheck, Sparkles, Star, TimerReset } from "lucide-react";

const workflowSteps = [
  {
    title: "Paste your script",
    body:
      "Drop in a draft, outline your talking points, or load a demo script to test the cadence before recording."
  },
  {
    title: "Customize the reading view",
    body:
      "Fine-tune scroll speed, font size, theme, fullscreen mode, and mirror settings to feel comfortable on-screen."
  },
  {
    title: "Record and review",
    body:
      "Open the live camera stage, rehearse once, and save or download your best take without leaving the browser."
  }
];

const useCases = [
  {
    title: "YouTube explainers",
    body:
      "Stay organized with natural pacing, strong hooks, and structured talking points for tutorials and product updates."
  },
  {
    title: "Instagram reels",
    body:
      "Keep short-form video scripts clear, quick, and conversational without needing to memorize every line."
  },
  {
    title: "Online teaching",
    body:
      "Move through lesson notes, examples, and transitions smoothly while keeping your audience engaged."
  },
  {
    title: "Teleprompter glass rigs",
    body:
      "Use mirror mode when your setup needs reversed text and keep the live camera preview clean and easy to read."
  }
];

const qualityNotes = [
  "Browser-first experience means no desktop app installation is required for the main workflow.",
  "Local drafts are kept on the device until you choose to save a script to your account.",
  "Camera and microphone access only happens after permission is granted by the browser.",
  "Helpful support pages cover setup, privacy, terms, and creator workflows without overwhelming the page."
];

const faqs = [
  {
    question: "Why do creators use it?",
    answer:
      "It keeps the reading flow natural, gives simple control over pacing and script layout, and lets creators record without juggling multiple tools."
  },
  {
    question: "Do I need an account to start?",
    answer:
      "No. You can write, test, and rehearse in the browser before deciding whether to save or sign in for extra features."
  },
  {
    question: "What if I want voice pacing?",
    answer:
      "Voice scroll is optional. It can help if you want the script to move more naturally with your speech, while fixed-speed mode still works for most creators."
  }
];

const featureHighlights = [
  {
    icon: Camera,
    title: "Camera-first workflow",
    body: "Go from script to live recording without switching between multiple apps or tools."
  },
  {
    icon: Mic,
    title: "Voice scroll support",
    body: "Let the script move with your pace and make delivery feel more natural while you speak."
  },
  {
    icon: ShieldCheck,
    title: "Clearer trust and privacy",
    body: "Permission-based access, straightforward controls, and helpful setup guidance keep users comfortable."
  },
  {
    icon: TimerReset,
    title: "Fast review loops",
    body: "Test a take, adjust the speed, and record again in a clean loop that keeps momentum high."
  }
];

const stats = [
  { value: "4.9/5", label: "creator experience" },
  { value: "1 click", label: "to start recording" },
  { value: "100%", label: "browser-based" }
];

const testimonials = [
  {
    name: "Ayesha K.",
    role: "YouTube creator",
    quote:
      "The flow feels natural and calm. I can rehearse, adjust speed, and record without losing my place or my focus."
  },
  {
    name: "Marco L.",
    role: "Course teacher",
    quote:
      "It is the first teleprompter that felt simple enough for real classroom recording and still gave me control over my pacing."
  },
  {
    name: "Priya S.",
    role: "Reels creator",
    quote:
      "The script stays readable, the controls are easy, and the live setup helps me deliver stronger short-form videos."
  }
];

export function HomepageContent() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 pb-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="space-y-5">
        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="section-kicker">Voice-controlled scrolling</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">Teleprompter That Follows Your Voice</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
                Stop worrying about scrolling speed. Speak naturally and let the teleprompter follow your pace. Voice scroll is optional, and manual scrolling remains ready whenever you need it.
              </p>
            </div>
            <Link href="/voice-scroll-teleprompter" className="cta-secondary">Explore voice scroll <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">A better reading flow</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
            Designed to make recording feel calmer, smoother, and more natural.
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
            FreeTeleprompter.in helps creators, teachers, and founders stay on-message without memorizing every line. The
            tool is designed to feel simple from the first click: paste your script, pick a pace, and record from a clean
            browser-based studio.
          </p>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="section-kicker">Why creators stay</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">
                Everything you need to speak confidently in one polished workspace.
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {featureHighlights.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="feature-showcase-card">
                    <div className="feature-icon-wrap">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="visual-showcase">
              <div className="visual-panel large">
                <div className="panel-badge">Live setup</div>
                <div className="visual-script">
                  <span className="visual-line wide" />
                  <span className="visual-line mid" />
                  <span className="visual-line short" />
                  <span className="visual-line mid" />
                  <span className="visual-line wide" />
                </div>
                <div className="visual-footer">
                  <span className="status-dot" />
                  Recording ready
                </div>
              </div>

              <div className="visual-panel small">
                <div className="mini-stat">
                  <Sparkles className="h-4 w-4" />
                  <span>Clean script flow</span>
                </div>
                <div className="mini-stat muted">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Saved scripts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="mini-metric-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Loved by creators</p>
              <h2 className="mt-2 text-xl font-semibold md:text-2xl">People keep coming back because it feels easy to use.</h2>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <Quote className="h-5 w-5 text-[var(--accent)]" />
                <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">“{item.quote}”</p>
                <div className="mt-4 border-t border-[var(--border)] pt-3">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="cta-banner">
            <div>
              <p className="section-kicker">Ready to record?</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">
                Start with a clean script and a smoother delivery.
              </h2>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link href="/teleprompter-app" className="cta-primary">
                Try the app now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-sm text-[var(--text-soft)]">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                No install required
              </div>
            </div>
          </div>
        </section>

        <section className="floating-cta-bar">
          <span>Start recording in seconds</span>
          <Link href="/teleprompter-app" className="cta-primary small-cta">
            Try the app now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <details className="accordion-panel" open>
          <summary className="accordion-summary"><span><span className="section-kicker">Workflow</span><span className="mt-2 block text-xl font-semibold">A lightweight process that keeps your attention on the delivery</span></span><span className="accordion-plus" aria-hidden="true" /></summary>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <article key={step.title} className="feature-card">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{step.body}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="accordion-panel">
          <summary className="accordion-summary"><span><span className="section-kicker">Use cases</span><span className="mt-2 block text-xl font-semibold">Built for the way people actually record and speak</span></span><span className="accordion-plus" aria-hidden="true" /></summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="feature-card">
                <h3 className="text-base font-semibold">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{useCase.body}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="accordion-panel">
          <summary className="accordion-summary"><span><span className="section-kicker">Trust and usability</span><span className="mt-2 block text-xl font-semibold">Clearer expectations before the recording starts</span></span><span className="accordion-plus" aria-hidden="true" /></summary>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-soft)] md:text-base">
                {qualityNotes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-kicker">Helpful pages</p>
              <h2 className="mt-2 text-xl font-semibold">Support that keeps users confident</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
                <Link href="/how-to-use" className="underline-offset-4 hover:underline">
                  How to use
                </Link>
                <Link href="/articles" className="underline-offset-4 hover:underline">
                  Articles
                </Link>
                <Link href="/teleprompter-for-youtube" className="underline-offset-4 hover:underline">
                  YouTube setup
                </Link>
                <Link href="/teleprompter-for-instagram-reels" className="underline-offset-4 hover:underline">
                  Reels setup
                </Link>
                <Link href="/voice-scroll-teleprompter" className="underline-offset-4 hover:underline">
                  Voice scroll
                </Link>
                <Link href="/mirror-mode-teleprompter" className="underline-offset-4 hover:underline">
                  Mirror mode
                </Link>
                <Link href="/privacy" className="underline-offset-4 hover:underline">
                  Privacy
                </Link>
                <Link href="/terms" className="underline-offset-4 hover:underline">
                  Terms
                </Link>
                <Link href="/contact" className="underline-offset-4 hover:underline">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </details>

        <details className="accordion-panel">
          <summary className="accordion-summary"><span><span className="section-kicker">FAQ</span><span className="mt-2 block text-xl font-semibold">Common questions from new users</span></span><span className="accordion-plus" aria-hidden="true" /></summary>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="feature-card">
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
