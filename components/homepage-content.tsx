import Link from "next/link";

const workflowSteps = [
  {
    title: "Prepare the script",
    body:
      "Paste your draft, break long sections into short speaking blocks, and use the demo script only when you want to test the controls quickly."
  },
  {
    title: "Tune the reading view",
    body:
      "Adjust speed, font size, theme, fullscreen mode, and mirror settings before recording so the teleprompter matches your distance from the screen."
  },
  {
    title: "Record and review",
    body:
      "Open the camera stage, rehearse once, record the take, then check the preview before deciding whether to download or repeat the session."
  }
];

const useCases = [
  {
    title: "YouTube explainers",
    body:
      "Use section headings and short transitions so tutorials, product demos, and founder updates stay organized without sounding memorized."
  },
  {
    title: "Instagram reels",
    body:
      "Write a strong hook, keep the body tight, and use slower scrolling for a more natural short-form delivery on mobile."
  },
  {
    title: "Online teaching",
    body:
      "Keep definitions, examples, and lesson transitions visible while recording classes, course modules, or webinar introductions."
  },
  {
    title: "Teleprompter glass rigs",
    body:
      "Turn on script mirror mode only when a physical beam-splitter setup needs reversed text, and test the camera preview separately."
  }
];

const qualityNotes = [
  "The tool works in the browser without requiring users to install a desktop app.",
  "Script drafts are kept locally unless a signed-in user chooses to save scripts to their account.",
  "Camera, microphone, and speech features run only after the browser asks for permission.",
  "The support pages explain privacy, terms, contact, setup guidance, and specific creator workflows."
];

const faqs = [
  {
    question: "What makes this different from a plain text scroller?",
    answer:
      "FreeTeleprompter.in combines the scroller with script editing, saved-script support, camera recording, mirror controls, voice-assisted pacing, and mobile-friendly stage controls."
  },
  {
    question: "Can I use it before signing in?",
    answer:
      "Yes. You can write or paste a script, adjust the teleprompter, and practice without an account. Signing in is used for cloud saved scripts and account-based features."
  },
  {
    question: "Is voice scroll required?",
    answer:
      "No. Fixed-speed scrolling works for most scripts. Voice-assisted pacing is an optional mode for users who want the prompt to feel less rigid while speaking."
  }
];

export function HomepageContent() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 pb-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="space-y-5">
        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Practical guide</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
            Free online teleprompter for creators, teachers, founders, and video teams
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
            FreeTeleprompter.in is built for people who need to speak clearly on camera without memorizing every
            sentence. The page above is the working teleprompter: paste your script, choose a comfortable reading
            speed, mirror the text when your setup needs it, and record a practice take from the browser.
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
            This guide explains the workflow in plain language so users can understand the tool before granting camera
            or microphone access. It also keeps the page useful for visitors who want to compare features, privacy
            behavior, and recording setup before starting a live session.
          </p>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Workflow</p>
          <h2 className="mt-2 text-xl font-semibold">A simple recording flow that works on desktop and mobile</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <article key={step.title} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Use cases</p>
          <h2 className="mt-2 text-xl font-semibold">Where a browser teleprompter is most useful</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <h3 className="text-base font-semibold">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{useCase.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="section-kicker">Trust and usability</p>
              <h2 className="mt-2 text-xl font-semibold">What users should know before recording</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-soft)] md:text-base">
                {qualityNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-kicker">Helpful pages</p>
              <h2 className="mt-2 text-xl font-semibold">Read setup guides and policies</h2>
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
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">FAQ</p>
          <h2 className="mt-2 text-xl font-semibold">Common questions about FreeTeleprompter.in</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
