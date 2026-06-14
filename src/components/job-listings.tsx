"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import { Briefcase, ArrowRight, FolderOpen } from "lucide-react"
import { JobListingSkeleton } from "./skeleton-loaders"
import { ProfessionalEmptyState } from "./empty-state"

//Backend job response type
interface BackendJob {
  id: number
  job_title: string
  description: string
  createdAt: string
  created_by?: string
}

//Frontend job type (after formatting)
interface Job {
  id: number
  title: string
  description: string
  type: string
  createdAt: string
}

export function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs/all")
        const backendJobs: BackendJob[] = res.data.data

        const formattedJobs: Job[] = backendJobs.map((job: BackendJob) => ({
          id: job.id,
          title: job.job_title,
          description: job.description,
          type: "Full-time",
          createdAt: new Date(job.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))

        setJobs(formattedJobs)
        console.log(formattedJobs)
      } catch (err) {
        console.error(err)
        setError("Failed to load job listings.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <section className="w-full py-16 md:py-24 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Open Positions
          </h2>
          <p className="text-lg text-foreground/70">
            View our current job openings and apply to join our team.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(1)].map((_, i) => (
              <JobListingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ProfessionalEmptyState
            icon={FolderOpen}
            title="Service Unavailable"
            description={error}
            action={
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-4 py-2 rounded-lg font-bold"
              >
                Refresh Page
              </button>
            }
          />
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <ProfessionalEmptyState
                icon={Briefcase}
                title="No Open Positions"
                description="We don't have any job openings right now. However, we're always looking for talent. Check back soon or follow us for updates!"
              />
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-secondary transition-colors hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{job.title}</h3>

                      <div className="flex flex-wrap gap-4 text-sm text-foreground/70 mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-secondary" />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      <p className="text-foreground/80 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start md:items-end">
                      <span className="text-xs text-foreground/60">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>

                      <Link
                        href={`/shared-ui/job-application/${job.id}`}
                        className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all"
                      >
                        Apply <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
