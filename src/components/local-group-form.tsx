"use client"

import React, { useState, useEffect } from "react"
import { Search, MapPin, Send, CheckCircle, ChevronDown, Check } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import Link from "next/link" // Added Link import
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"

export function LocalGroupForm() {
    const [formData, setFormData] = useState({
        membershipNumber: "",
        groupId: "",
    })
    const [groups, setGroups] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingGroups, setLoadingGroups] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "loading">("idle")
    
    // 🔹 Terms Consent State
    const [termsConsent, setTermsConsent] = useState(false)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoadingGroups(true)
                const res = await api.get("/api/local-groups/all")
                setGroups(Array.isArray(res.data?.data) ? res.data.data : [])
            } catch (err) {
                console.error("Failed to fetch local branches", err)
                setGroups([
                    { id: 1, name: "Nairobi Central Group", county: "Nairobi", constituency: "Starehe" },
                    { id: 2, name: "Kiambu Unity Group", county: "Kiambu", constituency: "Kiambu Town" },
                    { id: 3, name: "Mombasa Coastal Front", county: "Mombasa", constituency: "Mvita" },
                ])
            } finally {
                setLoadingGroups(false)
            }
        }
        fetchGroups()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation check for fields and terms
        if (!formData.membershipNumber || !formData.groupId) {
            toast.error("Please fill in all fields")
            return
        }

        if (!termsConsent) {
            toast.error("You must agree to the Terms & Conditions")
            return
        }

        try {
            setStatus("loading")
            await api.post("/api/local-groups/join", {
                membership_number: formData.membershipNumber,
                group_id: formData.groupId
            })
            toast.success("Application to join group submitted!")
            setStatus("success")
            setFormData({ membershipNumber: "", groupId: "" })
            setTermsConsent(false) // Reset terms on success
        } catch (error: any) {
            console.error("Join group error:", error)
            toast.error(error.response?.data?.message || "Failed to submit application")
            setStatus("idle")
        }
    }

    const selectedGroupLabel = groups.find(g => g.id.toString() === formData.groupId)
        ? `${groups.find(g => g.id.toString() === formData.groupId).county} - ${groups.find(g => g.id.toString() === formData.groupId).constituency}`
        : "Select local branch..."

    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Descriptive Text Section */}
                    <div className="text-foreground/70 leading-relaxed mb-12 lg:mb-0 lg:pr-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Connecting Communities</h2>
                        <p className="mb-4">
                            Local branches are the heartbeat of our movement. By organizing at the grassroots level, we ensure that every voice is heard and every community is represented.
                        </p>
                        <p className="mb-4">
                            Join a local branch to participate in decision-making, coordinate initiatives, and work with neighbors to build a stronger foundation for our nation, one village at a time.
                        </p>
                        <ul className="space-y-3 list-disc pl-5 mt-6">
                            <li>Grassroots engagement</li>
                            <li>Community leadership</li>
                            <li>Local impact</li>
                            <li>Unity in action</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-secondary/10 rounded-lg">
                                <MapPin className="text-secondary w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Join a Local Branch</h2>
                                <p className="text-muted-foreground text-sm">Find and connect with your local community</p>
                            </div>
                        </div>

                        {status === "success" && (
                            <div className="mb-8 p-4 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-up hover:bg-green-50/10 transition-colors">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-green-800">
                                    <p className="font-semibold">Request Submitted!</p>
                                    <p className="text-sm">Your request to join the group has been received and is being processed.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Membership Number *</label>
                                <Input
                                    type="text"
                                    value={formData.membershipNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, membershipNumber: e.target.value }))}
                                    required
                                    placeholder="SFU-2024-XXXXX"
                                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Select Your Branch *</label>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={popoverOpen}
                                            className="w-full justify-between px-4 h-10 border-border rounded-lg text-foreground bg-background hover:bg-muted font-normal text-left focus:ring-0 focus:border-secondary transition-colors shadow-none"
                                        >
                                            {selectedGroupLabel}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search by county or constituency..." className="h-9" />
                                            <CommandList className="max-h-[300px]">
                                                <CommandEmpty>No group found.</CommandEmpty>
                                                <CommandGroup>
                                                    {groups.map((group) => (
                                                        <CommandItem
                                                            key={group.id}
                                                            value={`${group.county} ${group.constituency}`}
                                                            onSelect={() => {
                                                                setFormData(prev => ({ ...prev, groupId: group.id.toString() }))
                                                                setPopoverOpen(false)
                                                            }}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{group.county}</span>
                                                                <span className="text-xs text-muted-foreground">{group.constituency}</span>
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    formData.groupId === group.id.toString() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="mt-6 space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={termsConsent}
                                        onChange={(e) => setTermsConsent(e.target.checked)}
                                        required
                                        className="w-4 h-4 accent-secondary mt-1 flex-shrink-0 cursor-pointer"
                                    />
                                    <span className="text-sm text-foreground cursor-pointer">
                                        I agree to the <Link href="/shared-ui/terms" className="text-secondary hover:underline font-semibold">Terms & Conditions</Link> and <Link href="/shared-ui/privacy" className="text-secondary hover:underline font-semibold">Privacy Policy</Link>. *
                                    </span>
                                </label>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={status === "loading" || !termsConsent}
                                    className="w-full bg-secondary hover:bg-secondary/90 text-white h-10 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <Spinner />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Join This Group</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}