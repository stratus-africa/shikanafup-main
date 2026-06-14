"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function CancelMembership() {
    const [isOpen, setIsOpen] = useState(false)
    const [memberId, setMemberId] = useState("")
    const [nationalId, setNationalId] = useState("")
    const [requestLoading, setRequestLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [hasConsent, setHasConsent] = useState(false)
    const [step, setStep] = useState<"request" | "otp">("request")
    const [otp, setOtp] = useState("")
    const [requestMessage, setRequestMessage] = useState<string | null>(null)

    const resetFlow = () => {
        setStep("request")
        setOtp("")
        setRequestMessage(null)
    }

    const handleRequestOtp = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (!memberId.trim()) {
            toast.error("Please enter your member ID")
            return
        }

        if (!nationalId.trim()) {
            toast.error("Please enter your National ID")
            return
        }

        if (!hasConsent) {
            toast.error("Please provide consent to continue")
            return
        }

        setRequestLoading(true)
        try {
            const response = await api.post(
                "/api/members/cancel/request-otp",
                {
                    memberId: memberId.trim(),
                    nationalId: nationalId.trim(),
                    hasConsent,
                },
                { validateStatus: () => true }
            )

            if (response.data?.statusCode === 200) {
                toast.success(response.data?.message || "OTP sent successfully")
                setRequestMessage(response.data?.message || "OTP sent successfully")
                setStep("otp")
            } else {
                toast.error(response.data?.message || "Failed to send OTP")
            }
        } catch (error) {
            console.error("Request OTP error:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setRequestLoading(false)
        }
    }

    const handleCancelMembership = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otp.length !== 6) {
            toast.error("OTP must be six digits")
            return
        }

        setCancelLoading(true)
        try {
            const response = await api.post(
                "/api/members/cancel/membership",
                {
                    memberId: memberId.trim(),
                    nationalId: nationalId.trim(),
                    otp,
                    hasConsent,
                },
                { validateStatus: () => true }
            )

            if (response.data?.statusCode === 200) {
                toast.success(response.data?.message || "Membership cancelled successfully")
                setMemberId("")
                setNationalId("")
                setHasConsent(false)
                resetFlow()
                setIsOpen(false)
            } else {
                toast.error(response.data?.message || "Failed to cancel membership")
            }
        } catch (error) {
            console.error("Cancel membership error:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setCancelLoading(false)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-sm text-secondary hover:underline cursor-pointer font-medium"
            >
                Click here
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex items-center justify-center mb-4">
                            <img src="/SFU-LOGO.png" alt="SFU Party Logo" className="w-20 h-auto" />
                        </div>
                        <DialogTitle className="text-center text-2xl">
                            Cancel Membership
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Enter your details below to cancel your membership with SFUP.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={step === "request" ? handleRequestOtp : handleCancelMembership}
                        className="space-y-4 pt-4"
                    >
                        {/* Member ID */}
                        <div>
                            <label
                                htmlFor="memberId"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Member ID *
                            </label>
                            <Input
                                id="memberId"
                                required
                                placeholder="e.g. SFUP-2024-001"
                                value={memberId}
                                onChange={(e) => {
                                    setMemberId(e.target.value)
                                    resetFlow()
                                }}
                                disabled={step === "otp"}
                                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                            />
                        </div>

                        {/* National ID */}
                        <div>
                            <label
                                htmlFor="nationalId"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                National ID *
                            </label>
                            <Input
                                id="nationalId"
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="e.g. 12345678"
                                value={nationalId}
                                onChange={(e) => {
                                    setNationalId(e.target.value.replace(/\D/g, ""))
                                    resetFlow()
                                }}
                                disabled={step === "otp"}
                                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                            />
                        </div>

                        {/* Consent */}
                        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={hasConsent}
                                onChange={(e) => {
                                    setHasConsent(e.target.checked)
                                    resetFlow()
                                }}
                                required
                                className="w-4 h-4 accent-secondary mt-1 flex-shrink-0 cursor-pointer"
                            />
                            <span className="text-sm text-foreground text-left">
                                I confirm that I wish to cancel my membership with SFUP and I understand this action is permanent. *
                            </span>
                        </label>

                        {step === "otp" && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Enter OTP *
                                </label>
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    required
                                    containerClassName="justify-center"
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                {requestMessage && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        {requestMessage}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        className="text-secondary hover:underline"
                                        onClick={handleRequestOtp}
                                        disabled={requestLoading}
                                    >
                                        Resend OTP
                                    </button>
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:underline"
                                        onClick={resetFlow}
                                        disabled={requestLoading || cancelLoading}
                                    >
                                        Edit details
                                    </button>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={
                                requestLoading ||
                                cancelLoading ||
                                !memberId.trim() ||
                                !nationalId.trim() ||
                                !hasConsent ||
                                (step === "otp" && otp.length !== 6)
                            }
                            className="w-full bg-accent hover:bg-accent/90 h-10"
                        >
                            {requestLoading || cancelLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    {step === "request" ? "Sending OTP..." : "Processing..."}
                                </>
                            ) : (
                                step === "request" ? "Send OTP" : "Cancel Membership"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
