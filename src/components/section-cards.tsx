"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"

interface CardSectionData {
  title: string
  value: string | number
  trend?: "up" | "down"
}

export function SectionCards() {
  const [data, setData] = useState<CardSectionData[]>([
    { title: "Total Members", value: 0 },
    { title: "Total Blogs", value: 0 },
    { title: "Total Events", value: 0 },
    { title: "Total Jobs", value: 0 },
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard-counts") 
        const json = await res.json()
        setData([
          { title: "Total Members", value: json.totalMembers },
          { title: "Total Blogs", value: json.totalBlogs },
          { title: "Total Events", value: json.totalEvents },
          { title: "Total Jobs", value: json.totalJobs },
        ])
      } catch (error) {
        console.error("Error fetching dashboard counts:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data.map((item, index) => (
        <Card className="@container/card" key={index}>
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {item.trend === "down" ? <IconTrendingDown /> : <IconTrendingUp />}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
