import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/next-shims";
import { Loader2, SearchCheck } from "lucide-react";
import { publicVerifyMembership } from "@/lib/public/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function VerifyMembership() {
  const verify = useServerFn(publicVerifyMembership);
  const [documentType, setDocumentType] = useState<"National ID" | "Passport">("National ID");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsChecking(true);
    setError("");
    setExists(null);
    try {
      const result = await verify({ data: { documentType, documentNumber: documentNumber.trim() } });
      setExists(result.exists);
    } catch (cause: any) {
      setError(cause?.message ?? "We could not verify your membership. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-muted/30 px-5 py-16 sm:px-8">
      <section className="mx-auto max-w-md border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <SearchCheck className="mx-auto mb-3 size-9 text-primary" />
          <h1 className="text-2xl font-bold">Verify membership</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your identification details to find your account.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-2">
            <Label>Identification document type</Label>
            <Select value={documentType} onValueChange={(value: "National ID" | "Passport") => setDocumentType(value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="National ID">National ID</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document-number">Identification document number</Label>
            <Input
              id="document-number"
              required
              value={documentNumber}
              onChange={(event) => {
                const value = event.target.value;
                setDocumentNumber(documentType === "National ID" ? value.replace(/\D/g, "").slice(0, 9) : value);
              }}
              inputMode={documentType === "National ID" ? "numeric" : "text"}
              placeholder={documentType === "National ID" ? "012345678" : "Enter passport number"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isChecking || !documentNumber.trim()}>
            {isChecking ? <><Loader2 className="mr-2 size-4 animate-spin" /> Checking</> : "Verify membership"}
          </Button>
        </form>
        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
        {exists !== null && (
          <div className="mt-6 border-t pt-5 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {exists ? "We found an account matching those details." : "We could not find an account matching those details."}
            </p>
            <Button asChild className="w-full"><Link href={exists ? "/login" : "/shared-ui/register"}>{exists ? "Log in" : "Sign up"}</Link></Button>
          </div>
        )}
      </section>
    </main>
  );
}
