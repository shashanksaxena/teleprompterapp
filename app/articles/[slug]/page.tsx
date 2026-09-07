import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { completeArticles, getArticle } from "@/lib/articles";
import { getSiteUrl, siteConfig } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return completeArticles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const path = `/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${siteUrl}${path}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [siteConfig.author],
      images: [
        {
          url: article.image,
          width: 1672,
          height: 941,
          alt: article.imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image]
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [`${siteUrl}${article.image}`],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: siteConfig.author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl
    },
    mainEntityOfPage: articleUrl
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[980px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="space-y-6">
        <header className="glass-panel overflow-hidden rounded-[18px]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            width={1672}
            height={941}
            priority
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="p-5 md:p-6">
            <p className="section-kicker">Teleprompter article</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{article.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] md:text-base">{article.intro}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
              <span>{article.readingTime}</span>
              <span>{article.datePublished}</span>
              <Link href="/articles" className="underline-offset-4 hover:underline">
                More articles
              </Link>
              <Link href="/" className="underline-offset-4 hover:underline">
                Open teleprompter
              </Link>
            </div>
          </div>
        </header>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <div className="space-y-7">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--text-soft)] md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {article.checklist?.length ? (
          <section className="glass-panel rounded-[18px] p-5 md:p-6">
            <p className="section-kicker">Quick checklist</p>
            <h2 className="mt-2 text-xl font-semibold">Before you record</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-soft)] md:grid-cols-2 md:text-base">
              {article.checklist.map((item) => (
                <li key={item} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">FAQ</p>
          <h2 className="mt-2 text-xl font-semibold">Common questions</h2>
          <div className="mt-4 space-y-5">
            {article.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-soft)] md:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[18px] p-5 md:p-6">
          <p className="section-kicker">Related reading</p>
          <h2 className="mt-2 text-xl font-semibold">Explore related teleprompter guides</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
            {article.related.map((link) => (
              <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
