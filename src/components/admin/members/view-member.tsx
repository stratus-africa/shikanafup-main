
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export type Member = {
  id: number
  first_name: string
  last_name: string
  member_code: string
  county: string
  constituency?: string
  ward?: string
  email: string
  phone: string
  dob?: string
  gender?: string
  specialInterest?: string
//   joinedAt: string
  status: "ACTIVE" | "INACTIVE"

}


type ViewMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
}

export function ViewMemberDialog({
  open,
  onOpenChange,
  member,
}: ViewMemberDialogProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <Detail label="First Name" value={member.first_name} />
          <Detail label="Last Name" value={member.last_name} />
          <Detail label="Membership Code" value={member.member_code} />
          <Detail label="Email" value={member.email} />
          <Detail label="Phone" value={member.phone} />
          <Detail label="County" value={member.county} />
          <Detail label="Constituency" value={member.constituency} />
          <Detail label="Ward" value={member.ward} />
          <Detail label="Date of Birth" value={member.dob} />
          <Detail label="Gender" value={member.gender} />
          <Detail label="Special Interest" value={member.specialInterest} /> 

          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge
              variant={member.status === "ACTIVE" ? "default" : "secondary"}
            >
              {member.status}
            </Badge>
          </div>

          {/* <Detail
            label="Joined On"
            value={new Date(member.joinedAt).toLocaleDateString()}
          /> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
