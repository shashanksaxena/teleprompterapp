import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { completeArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter articles and creator recording guides",
  description:
    "Read practical teleprompter articles for YouTube videos, Instagram reels, online teaching, mirror mode setups, voice scroll, and browser-based recording workflows.",
  path: "/articles",
  keywords: [
    "teleprompter articles",
    "teleprompter guides",
    "creator recording tips",
    "online teleprompter blog",
    "video teleprompter setup"
  ]
});

export default function ArticlesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="glass-panel rounded-[18px] p-5 md:p-6">
        <p className="section-kicker">Articles</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
          Teleprompter guides for creators, teachers, and video teams
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
          Practical articles for writing better scripts, setting up your camera, using mirror mode, recording lessons,
          and making voice-assisted teleprompter scrolling feel natural.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Open teleprompter
          </Link>
          <Link href="/how-to-use" className="underline-offset-4 hover:underline">
            How to use
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {completeArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="glass-panel group overflow-hidden rounded-[18px] transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              width={1672}
              height={941}
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <p className="section-kicker">{article.readingTime}</p>
              <h2 className="mt-2 text-xl font-semibold leading-tight group-hover:text-[var(--accent)]">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
