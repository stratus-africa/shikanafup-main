"use client"

import * as React from "react"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (open) {
            // Focus input when opened
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            // Clear query when closed
            setQuery("")
        }
    }, [open])

    const handleSearch = (direction: 'next' | 'prev' = 'next') => {
        if (!query) return

        // Type definition for window.find
        // find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog)
        const win = window as any
        if (win.find) {
            // Note: window.find is non-standard but works in most browsers (Chrome, Firefox)
            const found = win.find(query, false, direction === 'prev', true, false, true, false)

            if (!found) {
                // If wrapped around or not found, one might want to give feedback, 
                // but window.find typically handles selection. 
                // If absolutely nothing is found, we could shake the input or similar.
            }
        } else {
            alert("Your browser does not support in-page search via this tool. Please use Ctrl+F.")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch(e.shiftKey ? 'prev' : 'next')
        }
        if (e.key === 'Escape') {
            onOpenChange(false)
        }
    }

    if (!open) return null

    return (
        <div className={cn(
            "fixed top-24 right-4 z-50 w-80 bg-background border border-border shadow-lg rounded-lg p-2",
            "animate-in fade-in slide-in-from-top-5 duration-200"
        )}>
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground ml-2" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Find in page..."
                    className="h-8 border-none focus-visible:ring-0 px-2 bg-transparent ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                />
                <div className="flex items-center border-l pl-1 gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSearch('prev')} title="Previous match">
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSearch('next')} title="Next match">
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-1 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onOpenChange(false)}
                    title="Close"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
