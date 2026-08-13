import { useState } from "react";
import { Heart, Loader2, CheckCircle, XCircle, User, Mail, Phone, DollarSign } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Link } from "@/lib/next-shims";

type PaymentMethod = "mpesa" | "airtel";
type PaymentStatus = "idle" | "initiating" | "pending" | "success" | "failed";

export function DonationOptions() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🔹 Personal details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // 🔹 Terms Consent State
  const [termsConsent, setTermsConsent] = useState(false);

  const presetAmounts = [500, 5000, 10000, 50000, 300000];

  const personalDetailsValid =
    isAnonymous || (firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "");

  // Updated logic to include termsConsent
  const canSubmit =
    selectedAmount &&
    paymentMethod &&
    phoneNumber.trim().length >= 9 &&
    personalDetailsValid &&
    termsConsent && // <--- Added this
    paymentStatus === "idle";

  async function handlePayment() {
    if (!canSubmit) return;

    setPaymentStatus("initiating");
    setErrorMessage(null);

    try {
      const payload = {
        amount: selectedAmount,
        phone_number: phoneNumber,
        payment_method: paymentMethod,
        donation_type: donationType,
        is_anonymous: isAnonymous,
        ...(isAnonymous
          ? {}
          : {
              first_name: firstName,
              last_name: lastName,
              email: email,
            }),
      };

      await api.post("/api/donations/electronic", payload);
      setPaymentStatus("success");
      toast.success("Thank you for your donation!");

      // Reset after success
      setTimeout(() => {
        setPaymentStatus("idle");
        setSelectedAmount(null);
        setPhoneNumber("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setIsAnonymous(false);
        setTermsConsent(false); // Reset checkbox
      }, 3000);
    } catch (error) {
      console.error("Donation failed", error);
      setPaymentStatus("failed");
      setErrorMessage("Failed to initiate payment. Please try again.");
      toast.error("Payment initiation failed");
    }
  }

  return (
    <section id="donation-options" className="w-full bg-[#f4f1ed] py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Make a contribution</p>
          <h2 className="mt-4 text-4xl font-bold text-secondary">Invest in the Vision</h2>
          <p className="mt-4 text-lg text-foreground/70">You will receive a payment prompt on your phone</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
          {/* Make Contribution Card */}
          <div className="border border-secondary/15 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(10,25,47,.5)] sm:p-9">
            {/* Amount */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-4">Amount (KES)</label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 rounded-lg font-bold ${
                      selectedAmount === amount ? "bg-secondary text-white" : "bg-muted hover:bg-secondary/20"
                    }`}
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min={1}
                value={selectedAmount ?? ""}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value);
                  setSelectedAmount(Number.isNaN(value) ? null : value);
                }}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Other amount"
              />
            </div>

            {/* Personal Details Checkbox */}
            <div className="flex items-center gap-3 p-4 mb-8 bg-muted rounded-lg border border-border">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded mt-1 accent-secondary"
              />
              <label htmlFor="anonymous" className="text-sm font-medium text-foreground cursor-pointer">
                Make this donation anonymous
              </label>
            </div>

            {!isAnonymous && (
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="block text-sm font-medium text-foreground mb-2">First Name</h3>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-secondary bg-transparent"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="block text-sm font-medium text-foreground mb-2">Last Name</h3>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-secondary bg-transparent"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 px-0 md:px-0">
                  <div className="flex-1">
                    <h3 className="block text-sm font-medium text-foreground mb-2">Email Address</h3>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-secondary bg-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amount Label with Icon */}
            <div className="flex gap-4 mb-4">
              <div>
                <h3 className="font-bold text-foreground mb-1">Donation Amount</h3>
                <p className="text-sm text-muted-foreground">Select or enter the amount you wish to contribute</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-4">Payment Method</label>

              <div className="flex gap-6">
                {(["mpesa", "airtel"] as PaymentMethod[]).map((method) => {
                  const isSelected = paymentMethod === method;

                  return (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition
                      ${isSelected ? "border-secondary bg-secondary/10" : "border-border hover:bg-muted"}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method)}
                      />

                      <img
                        src={method === "mpesa" ? "/mpesa_logo.webp" : "/airtel_logo.svg"}
                        className="h-7 w-auto"
                        alt={method}
                      />

                      <span className="font-medium">{method === "mpesa" ? "M-Pesa" : "Airtel Money"}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Phone */}
            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-1 text-sm tracking-wider">Phone Number</h3>
                  <p className="text-xs text-muted-foreground mb-3">You will receive a STK push on this number</p>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-secondary bg-transparent"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Status UI */}
            {paymentStatus === "pending" && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-muted rounded-lg">
                <Loader2 className="animate-spin" />
                <span>Waiting for payment confirmation on your phone…</span>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 text-green-700 rounded-lg">
                <CheckCircle />
                <span>Payment successful. Thank you for your support!</span>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 text-red-700 rounded-lg">
                <XCircle />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="mt-6 mb-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={termsConsent}
                  onChange={(e) => setTermsConsent(e.target.checked)}
                  required
                  className="w-4 h-4 accent-secondary mt-1 flex-shrink-0 cursor-pointer"
                />
                <span className="text-sm text-foreground cursor-pointer">
                  I agree to the{" "}
                  <Link href="/shared-ui/terms" className="text-secondary hover:underline font-semibold">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/shared-ui/privacy" className="text-secondary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  . *
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={!canSubmit || paymentStatus !== "idle"}
              onClick={handlePayment}
              className="w-full bg-primary text-white py-4 font-bold text-lg transition hover:bg-primary/85
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {paymentStatus === "initiating" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Initiating Payment…
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Pay Now
                </>
              )}
            </button>
          </div>

          {/* Financial Transparency Card */}
          <div className="border border-secondary/15 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(10,25,47,.5)] sm:p-9 flex flex-col justify-start">
            <h3 className="text-2xl font-bold text-foreground mb-4">Financial Transparency</h3>
            <p className="text-lg text-foreground/70 mb-6 flex-grow">
              We believe in complete transparency. All donations are tracked and reported according to campaign finance
              regulations. Download our annual financial reports to see exactly how funds are used.
            </p>
            <button className="bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors">
              View Financial Reports
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
