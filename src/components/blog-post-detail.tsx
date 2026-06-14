'use client'

import { Calendar, User, Clock } from 'lucide-react'

interface Article {
  id: number
  title: string
  content: string
  createdAt: string
  posted_by: string
  image: string
  category: string
  readTime: string
}

export function BlogPostDetail({ article }: { article: Article }) {
  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full font-bold text-sm">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight text-balance">
            {article.title}
          </h1>
          {/* <p className="text-xl text-foreground/70 mb-6">{article.excerpt}</p> */}

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 py-6 border-y border-border">
            <div className="flex items-center gap-2 text-foreground/60">
              <Calendar size={18} className="text-secondary" />
              {/* <span>{article.date}</span> */}
              <span>
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60">
              <User size={18} className="text-secondary" />
              <span>{article.posted_by}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60">
              <Clock size={18} className="text-secondary" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-lg overflow-hidden">
          <img
            src={article.image || '/placeholder.svg'}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-foreground">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 leading-relaxed text-foreground/80">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
