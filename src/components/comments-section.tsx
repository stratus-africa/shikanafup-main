'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle, Send, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'
import toast from 'react-hot-toast'

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface Comment {
  id: number
  name: string
  email: string
  comment: string
  date: string
  approved: boolean
}

export function CommentsSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: 'John Mwangi',
      email: 'john@example.com',
      comment: 'Excellent article! This aligns well with what our community needs. Looking forward to seeing these initiatives implemented.',
      date: 'March 11, 2025',
      approved: true,
    },
    {
      id: 2,
      name: 'Grace Kamau',
      email: 'grace@example.com',
      comment: 'The focus on unity is exactly what our nation needs. I appreciate the thoughtful approach to policy-making.',
      date: 'March 10, 2025',
      approved: true,
    },
  ])

  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  // Prefill form with user data
  useEffect(() => {
    if (user) {
      if (user.first_name || user.last_name) {
        setValue('name', `${user.first_name || ''} ${user.last_name || ''}`.trim())
      } else if (user.username) {
        setValue('name', user.username)
      }

      if (user.email) {
        setValue('email', user.email)
      }
    }
  }, [user, setValue])

  const onSubmit = async (data: CommentFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: comments.length + 1,
      ...data,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      approved: false,
    }

    setComments([newComment, ...comments])
    reset()
  }

  return (
    <section className="w-full py-12 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={28} className="text-secondary" />
            <h2 className="text-3xl font-bold text-foreground">Comments</h2>
            <span className="text-foreground/60">({comments.filter((c) => c.approved).length})</span>
          </div>
          <p className="text-foreground/70">
            Share your thoughts and engage with our community. All comments are moderated to maintain respectful discourse.
          </p>
        </div>

        {/* Comment Form */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-foreground mb-6">Leave a Comment</h3>

          {!user ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 bg-muted/30 rounded-lg border border-dashed border-border">
              <div className="bg-secondary/10 p-3 rounded-full">
                <Lock className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold">Login to Comment</h4>
              <p className="text-muted-foreground text-sm max-w-sm">
                Join the conversation! You must be logged in to post a comment.
              </p>
              <Link href="/login">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Login 
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input
                    {...register('name')}
                    placeholder="Your name"
                    className="w-full"
                    readOnly={!!user} // Optional: Make readOnly if we want to enforce identity
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full"
                    readOnly={!!user}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Comment</label>
                <Textarea
                  {...register('comment')}
                  placeholder="Share your thoughts..."
                  rows={5}
                  className="w-full"
                />
                {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">
                  Your email will not be published. Required fields are marked *
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-secondary text-white hover:bg-secondary/90"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                  {!isSubmitting && <Send size={16} />}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mb-6">
            {comments.filter((c) => c.approved).length} Approved Comments
          </h3>
          {comments.filter((c) => c.approved).length > 0 ? (
            comments
              .filter((c) => c.approved)
              .map((comment) => (
                <div key={comment.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">{comment.name}</h4>
                      <p className="text-sm text-foreground/60">{comment.date}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{comment.comment}</p>
                </div>
              ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-foreground/60">No approved comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Pending Comments Notice */}
        {comments.some((c) => !c.approved) && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-sm">
              <strong>Note:</strong> Your comment has been submitted and is awaiting moderation. Thank you for your engagement!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
