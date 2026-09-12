"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Article } from "@/lib/articles";

const ARTICLES_PER_BATCH = 6;

export function ArticleList({ articles }: { articles: Article[] }) {
    const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_BATCH);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef(false);

    const loadNextBatch = () => {
        if (loadingRef.current || visibleCount >= articles.length) {
            return;
        }

        loadingRef.current = true;
        setVisibleCount((current) => Math.min(current + ARTICLES_PER_BATCH, articles.length));
        window.setTimeout(() => {
            loadingRef.current = false;
        }, 250);
    };

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || visibleCount >= articles.length || typeof IntersectionObserver === "undefined") {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadNextBatch();
                }
            },
            { rootMargin: "0px 0px 160px" }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [articles.length, visibleCount]);

    return (
        <>
            <section className="grid gap-4 md:grid-cols-2">
                {articles.slice(0, visibleCount).map((article) => (
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
                            loading="lazy"
                            className="aspect-[16/9] w-full object-cover"
                        />
                        <div className="p-5">
                            <p className="section-kicker">{article.readingTime} · {article.datePublished} · Shashank Saxena</p>
                            <h2 className="mt-2 text-xl font-semibold leading-tight group-hover:text-[var(--accent)]">
                                {article.title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
                        </div>
                    </Link>
                ))}
            </section>
            {visibleCount < articles.length ? (
                <div ref={loadMoreRef} className="flex justify-center py-2">
                    <button type="button" onClick={loadNextBatch} className="control-chip px-4 py-2 text-sm">
                        Load more articles
                    </button>
                </div>
            ) : null}
        </>
    );
}