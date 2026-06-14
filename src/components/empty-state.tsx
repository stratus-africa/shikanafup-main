"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"

interface ProfessionalEmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
}

export function ProfessionalEmptyState({
    icon: Icon,
    title,
    description,
    action
}: ProfessionalEmptyStateProps) {
    return (
        <div className="w-full py-12 flex justify-center items-center">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Icon className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>{title}</EmptyTitle>
                    <EmptyDescription>{description}</EmptyDescription>
                </EmptyHeader>
                {action && (
                    <EmptyContent>
                        {action}
                    </EmptyContent>
                )}
            </Empty>
        </div>
    )
}
