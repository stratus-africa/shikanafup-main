'use client'

import Link from 'next/link'
import { blogArticles } from '@/lib/blog-data'
import { Calendar, ArrowRight } from 'lucide-react'

export function RelatedArticles({ currentArticleId }: { currentArticleId: number }) {
  const currentArticle = blogArticles.find((a) => a.id === currentArticleId)
  const related = blogArticles
    .filter((article) => article.category === currentArticle?.category && article.id !== currentArticleId)
    .slice(0, 3)

  if (related.length === 0) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              <img
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-4">
                <span className="inline-block text-xs font-bold text-secondary mb-2">{article.category}</span>
                <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-foreground/60 mb-3">
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-secondary font-bold group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
