"use client"
import React, { useState, useEffect } from "react"
import { Send, CheckCircle, Lock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PartyPositionForm() {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membershipNumber: "",
        position: ""
    })

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "",
                phone: user.phone || prev.phone,
            }))
        }
    }, [user])

    // Party leadership positions
    const partyPositions = [
        { value: "president", label: "01. President" },
        { value: "deputy_president", label: "02. Deputy President" },
        { value: "party_leader", label: "03. Party Leader" },
        { value: "deputy_party_leader", label: "04. Deputy Party leader" },
        { value: "national_chairperson", label: "05. National Chairperson" },
        { value: "deputy_national_chairperson", label: "06. Deputy National Chairperson" },
        { value: "secretary_general", label: "07. Secretary General" },
        { value: "deputy_secretary_general", label: "08. Deputy Secretary General" },
        { value: "national_treasurer", label: "09. National Treasurer" },
        { value: "deputy_national_treasurer", label: "10. Deputy National Treasurer" },
        { value: "secretary_national_oversight_and_audit", label: "11. Secretary, National Oversight and Audit" },
        { value: "deputy_secretary_national_oversight_and_audit", label: "12. Deputy Secretary, National Oversight and Audit" },
        { value: "adviser_national_justice_legal_and_constitutional_affairs", label: "13. Adviser, National Justice, Legal and Constitutional Affairs" },
        { value: "deputy_adviser_national_justice_legal_and_constitutional_affairs", label: "14. Deputy Adviser, National Justice, Legal and Constitutional Affairs" },
        { value: "secretary_national_organizing_and_membership_affairs", label: "15. Secretary, National Organizing and Membership Affairs" },
        { value: "deputy_secretary_national_organizing_and_membership_affairs", label: "16. Deputy Secretary, National Organizing and Membership Affairs" },
        { value: "secretary_national_publicity_and_media_relations", label: "17. Secretary, National Publicity and Media Relations" },
        { value: "deputy_secretary_national_publicity_and_media_relations", label: "18. Deputy Secretary, National Publicity and Media Relations" },
        { value: "secretary_party_elected_leaders_group", label: "19. Secretary, Party Elected Leaders Group (County, National Assembly and Senate)" },
        { value: "leader_national_youth_chapter_affairs", label: "20. Leader, National Youth Chapter Affairs" },
        { value: "deputy_leader_national_youth_chapter_affairs", label: "21. Deputy Leader, National Youth Chapter Affairs" },
        { value: "leader_national_women_chapter_affairs", label: "22. Leader, National Women Chapter Affairs" },
        { value: "leader_deputy_national_women_chapter_affairs", label: "23. Leader Deputy, National Women Chapter Affairs" },
        { value: "leader_national_chapter_for_special_interests_affairs", label: "24. Leader, National Chapter for Special Interests Affairs" },
        { value: "leader_deputy_national_chapter_for_special_interests_affairs", label: "25. Leader Deputy, National Chapter for Special Interests Affairs" },
        { value: "director_campaigns_and_mobilization_strategy", label: "26. Director, Campaigns and Mobilization Strategy" },
        { value: "deputy_director_of_campaigns_and_mobilization_strategy", label: "27. Deputy Director of Campaigns and Mobilization Strategy" },
        { value: "director_nominations_and_candidate_elections", label: "28. Director, Nominations and Candidate Elections" },
        { value: "deputy_director_of_nominations_and_candidate_elections", label: "29. Deputy Director of Nominations and Candidate Elections" },
        { value: "national_chairperson_house_of_elders", label: "30. National Chairperson, House of Elders" },
        { value: "deputy_national_chairperson_house_of_elders", label: "31. Deputy National Chairperson, House of Elders" },
        { value: "national_executive_director", label: "32. National Executive Director (Ex-Officio)" },
        { value: "secretary_tourism_and_wildlife_services", label: "33. Secretary, Tourism and Wildlife Services" },
        { value: "secretary_defense_and_homeland_security", label: "34. Secretary, Defense and Homeland Security" },
        { value: "secretary_sports_arts_and_cultural_heritage", label: "35. Secretary, Sports, Arts and Cultural Heritage" },
        { value: "secretary_agriculture_livestock_and_fisheries", label: "36. Secretary, Agriculture, Livestock and Fisheries" },
        { value: "secretary_education_science_and_technology", label: "37. Secretary, Education, Science and Technology" },
        { value: "secretary_public_policy_and_economic_planning", label: "38. Secretary, Public Policy and Economic Planning" },
        { value: "secretary_corporate_strategy_political_affairs", label: "39. Secretary, Corporate Strategy & Political Affairs" },
        { value: "secretary_professional_regulatory_bodies_affairs", label: "40. Secretary, Professional Regulatory Bodies Affairs" },
        { value: "secretary_international_relations_and_eac_affairs", label: "41. Secretary, International Relations and EAC Affairs" },
        { value: "secretary_energy_minerals_and_natural_resources", label: "42. Secretary, Energy, Minerals and Natural Resources" },
        { value: "secretary_investments_trade_and_industrialization", label: "43. Secretary, Investments, Trade and Industrialization" },
        { value: "secretary_public_finance_and_resource_mobilization", label: "44. Secretary, Public Finance and Resource Mobilization" },
        { value: "secretary_environment_forestry_and_water_resources", label: "45. Secretary, Environment, Forestry and Water Resources" },
        { value: "secretary_social_welfare_and_deferentially_able_affairs", label: "46. Secretary, Social Welfare and Deferentially Able Affairs" },
        { value: "secretary_public_service_and_human_resource_development", label: "47. Secretary, Public Service, and Human Resource Development" },
        { value: "secretary_transport_and_physical_infrastructure_development", label: "48. Secretary, Transport and Physical Infrastructure Development" },
        { value: "secretary_special_programmes_and_disaster_management_affairs", label: "49. Secretary, Special programmes and Disaster Management Affairs" },
        { value: "secretary_county_government_coordination_and_internal_cooperation", label: "50. Secretary, County Government Coordination and Internal Cooperation" },
    ]

    const [popoverOpen, setPopoverOpen] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        setStatus("loading")

        if (!validateForm()) {
            setStatus("idle")
            return
        }

        try {
            const response = await api.post("/api/party-positions/apply", {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                membership_number: formData.membershipNumber,
                position: formData.position,
            })

            if (response.status === 200 || response.status === 201) {
                toast.success("Application submitted successfully!")
                setStatus("success")

                // Clear form data
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    membershipNumber: "",
                    position: ""
                })
            } else {
                throw new Error(response.data?.message || "Submission failed")
            }

        } catch (error: any) {
            console.error("Registration error:", error)
            setStatus("error")
            toast.error(error.response?.data?.message || error.message || "Registration failed")
        } finally {
            if (status !== "success") setStatus("idle")
        }
    }

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address")
            return false
        }

        const phoneRegex = /^(\+254|0)[17]\d{8}$/
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
            toast.error("Please enter a valid Kenyan phone number")
            return false
        }

        if (!formData.firstName || !formData.lastName || !formData.membershipNumber || !formData.position) {
            toast.error("Please fill in all required fields")
            return false
        }

        return true
    }

    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="hidden lg:block text-foreground/70">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Drive the Vision</h2>
                        <p className="mb-4">
                            Apply for a leadership position within the Shikana Frontliners for Unity Party. We are looking for dedicated individuals to help shape our future.
                        </p>
                        <ul className="space-y-3 list-disc pl-5">
                            <li>Lead with integrity</li>
                            <li>Shape party strategy</li>
                            <li>Engage with the community</li>
                            <li>Represent the people</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-6">Party Position Application</h3>

                        {!user ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                <div className="bg-secondary/10 p-4 rounded-full">
                                    <Lock className="w-12 h-12 text-secondary" />
                                </div>
                                <h4 className="text-xl font-semibold">Login Required</h4>
                                <p className="text-muted-foreground max-w-md">
                                    You must be logged in to apply for a party leadership position.
                                </p>
                                <Link href="/login">
                                    <Button className="bg-secondary hover:bg-secondary/90 text-white min-w-[150px]">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {status === "success" && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                        <div className="text-green-800">
                                            <p className="font-semibold">Application Successful!</p>
                                            <p className="text-sm">Your application for a party position has been submitted successfully.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                disabled={status === "loading" || status === "success"}
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                disabled={status === "loading" || status === "success"}
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="Steve"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={status === "loading" || status === "success"}
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            disabled={status === "loading" || status === "success"}
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="+254712345678 or 0712345678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Membership Number *</label>
                                        <input
                                            type="text"
                                            name="membershipNumber"
                                            value={formData.membershipNumber}
                                            onChange={handleChange}
                                            required
                                            disabled={status === "loading" || status === "success"}
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="SFU-2024-12345"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Party Position *</label>
                                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={popoverOpen}
                                                    className="w-full justify-between px-4 py-2 h-auto border-border rounded-lg text-foreground bg-background hover:bg-muted font-normal text-left focus:ring-0 focus:border-secondary transition-colors shadow-none"
                                                    disabled={status === "loading" || status === "success"}
                                                >
                                                    {formData.position
                                                        ? partyPositions.find((pos) => pos.value === formData.position)?.label
                                                        : "Select Party Position..."}
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                <Command className="w-full">
                                                    <CommandInput placeholder="Search position..." className="h-9" />
                                                    <CommandList className="max-h-[300px]">
                                                        <CommandEmpty>No position found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {partyPositions.map((pos) => (
                                                                <CommandItem
                                                                    key={pos.value}
                                                                    value={pos.label}
                                                                    onSelect={() => {
                                                                        setFormData(prev => ({ ...prev, position: pos.value }))
                                                                        setPopoverOpen(false)
                                                                    }}
                                                                >
                                                                    {pos.label}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            formData.position === pos.value ? "opacity-100" : "opacity-0"
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

                                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                                        <input type="checkbox" id="party-consent" required className="w-4 h-4 rounded mt-1 cursor-pointer" />
                                        <label htmlFor="party-consent" className="text-sm text-foreground cursor-pointer">
                                            I agree to the <Link href="/shared-ui/terms" className="text-secondary hover:underline">Terms & Conditions</Link> and <Link href="/shared-ui/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={status === "loading" || status === "success"}
                                        className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <Spinner className="mr-2" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Application
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
