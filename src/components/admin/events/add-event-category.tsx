
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  ImageIcon,
  FileText,
  Tag,
  Upload,
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export default function AddEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    event_type: "",
    title: "",
    event_date: "",
    from_time: "",
    to_time: "",
    location: "",
    description: "",
    image: "",
    fileName: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((p) => ({ ...p, event_type: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((p) => ({
        ...p,
        image: reader.result as string,
        fileName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    const {
      event_type,
      title,
      event_date,
      from_time,
      to_time,
      location,
      description,
      image,
    } = formData

    if (
      !event_type ||
      !title ||
      !event_date ||
      !from_time ||
      !to_time ||
      !location ||
      !description ||
      !image
    ) {
      toast.error("All fields are required")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post("/api/events/add", formData)

      if (response.data?.statusCode === 200) {
        toast.success(response.data.message)
        setFormData({
          event_type: "",
          title: "",
          event_date: "",
          from_time: "",
          to_time: "",
          location: "",
          description: "",
          image: "",
          fileName: "",
        })
      } else {
        toast.error(response.data?.message)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-1">
      {/* Header */}
      <div className="pb-4 mb-6 border-b">
        <h2 className="text-2xl font-semibold">Create New Event</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to publish a new event
        </p>
      </div>

      <div className="space-y-6 pb-4">
        {/* Event Type & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Event Type
            </Label>
            <Select
              value={formData.event_type}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Meetup">Meetup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Event Title
            </Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Event Date
            </Label>
            <Input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              From Time
            </Label>
            <Input
              type="time"
              name="from_time"
              value={formData.from_time}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              To Time
            </Label>
            <Input
              type="time"
              name="to_time"
              value={formData.to_time}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="min-h-[150px]"
            placeholder="Describe the event..."
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Event Banner
          </Label>

          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <Label
            htmlFor="image"
            className="flex items-center justify-center gap-3 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
          >
            <Upload className="h-5 w-5" />
            <span>
              {formData.fileName || "Click to upload event image"}
            </span>
          </Label>

          {formData.image && (
            <img
              src={formData.image}
              className="mt-4 rounded-lg max-h-48 object-cover"
            />
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </div>
    </div>
  )
}
