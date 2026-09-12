import Link from "next/link";

import { siteConfig } from "@/lib/site";

type ContentPageProps = {
  kicker: string;
  title: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  useCases?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  relatedLinks?: {
    href: string;
    label: string;
  }[];
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
};

export function ContentPage({
  kicker,
  title,
  intro,
  sections,
  useCases,
  faqs,
  relatedLinks,
  beforeContent,
  afterContent
}: ContentPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="glass-panel rounded-[18px] p-5 md:p-6">
        <p className="section-kicker">{kicker}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] md:text-base">{intro}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-soft)]">
          <Link href="/" className="cta-primary inline-flex items-center">
            Open teleprompter
          </Link>
          <Link href="/how-to-use" className="cta-secondary inline-flex items-center">
            How to use
          </Link>
          <Link href="/contact" className="cta-secondary inline-flex items-center">
            Contact
          </Link>
        </div>
      </header>

      {beforeContent}

      <section className="glass-panel rounded-[18px] p-5 md:p-6">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <div className="mt-2 space-y-3 text-sm leading-7 text-[var(--text-soft)] md:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {useCases?.length ? (
        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Best use cases</p>
          <h2 className="mt-2 text-lg font-semibold">Who this page is most useful for</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm text-[var(--text-soft)]"
              >
                {useCase}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {faqs?.length ? (
        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">FAQ</p>
          <h2 className="mt-2 text-lg font-semibold">Common questions</h2>
          <div className="mt-4 space-y-5">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-soft)] md:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {relatedLinks?.length ? (
        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Related guides</p>
          <h2 className="mt-2 text-lg font-semibold">Explore related teleprompter topics</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
            {relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {afterContent}

      <section className="glass-panel rounded-[18px] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="section-kicker">Maintained by</p>
            <h2 className="mt-2 text-lg font-semibold">{siteConfig.author}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-soft)] md:text-base">
              Developed with love in {siteConfig.country}. For support, feedback, or partnership queries, write to{" "}
              <a className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.supportEmail}`}>
                {siteConfig.supportEmail}
              </a>
              .
            </p>
          </div>
          <div className="text-sm text-[var(--text-soft)]">
            <Link href="/" className="cta-primary inline-flex items-center">
              Open teleprompter tool
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
