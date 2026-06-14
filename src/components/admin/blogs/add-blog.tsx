
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Tag, ImageIcon, Star } from "lucide-react"
import api from "@/lib/axios"
import { toast, Toaster } from "react-hot-toast"

const BLOG_CATEGORIES = [
  "Party News",
  "Policy Updates",
  "Events",
  "Press Releases",
  "Opinion",
  "Community Outreach",
  "Youth Engagement",
  "Legislative Updates",
  "Campaigns",
]

type AddNewBlogProps = {
  onSuccess?: () => void
  initialData?: any
  mode?: "add" | "edit" | "view"
}

export default function AddNewBlog({ onSuccess, initialData, mode = "add" }: AddNewBlogProps) {
  const isView = mode === "view"
  const isEdit = mode === "edit"

  const [title, setTitle] = useState(initialData?.title || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [image, setImage] = useState<string | null>(initialData?.image || null)
  const [isMain, setIsMain] = useState(initialData?.is_main === "Y")
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setCategory(initialData.category || "")
      setContent(initialData.content || "")
      setImage(initialData.image || null)
      setIsMain(initialData.is_main === "Y")
    }
  }, [initialData])

  useEffect(() => {
    async function getCategory() {
      try {
        const response = await api.get("/api/blog/get/all/blogCategory")
        setCategoryData(response.data?.data || [])
      } catch (error) { }
    }
    getCategory()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    if (!title || !category || !content || (!image && !isEdit)) {
      toast.error("Required fields are missing")
      return
    }

    try {
      setIsSubmitting(true)
      const blogData: any = {
        title,
        category,
        content,
        image,
        is_main: isMain ? "Y" : "N"
      }

      let response;
      if (isEdit) {
        blogData.id = initialData.id
        response = await api.patch("/api/blog/update", blogData)
      } else {
        response = await api.post("/api/blog/add", blogData)
      }

      if (
        response.data?.message === "Blog updated successfully" ||
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        toast.success(response.data?.message || (isEdit ? "Blog updated" : "Blog published"))
        if (!isEdit) {
          setTitle("")
          setCategory("")
          setContent("")
          setImage(null)
          setFileName("")
          setIsMain(false)
        }
        onSuccess?.()
      } else {
        toast.error(response.data?.message || "Operation failed")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-1">
      <div className="pb-4 mb-6 border-b">
        <h2 className="text-2xl font-semibold text-foreground">
          {isView ? "Blog Details" : isEdit ? "Update Blog Post" : "Create New Blog Post"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isView ? "Information about this blog post" : "Fill in the details below to publish a new blog post"}
        </p>
      </div>

      <div className="space-y-6 pb-4">
        {/* Title and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Blog Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title"
              className="h-10"
              readOnly={isView}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={isView}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((cat, idx) => (
                  <SelectItem value={cat} key={idx}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <Label htmlFor="content" className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Content
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            className="min-h-[200px] resize-y"
            readOnly={isView}
          />
          <p className="text-xs text-muted-foreground">{content.length} characters</p>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="image" className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            Featured Image
          </Label>
          {!isView && (
            <div className="relative">
              <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <Label
                htmlFor="image"
                className="flex items-center justify-center gap-3 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {fileName ? fileName : image ? "Change featured image" : "Click to upload an image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </Label>
            </div>
          )}

          {image && (
            <div className="mt-4 relative rounded-lg overflow-hidden border border-border">
              <img src={image || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
              {!isView && (
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setImage(null)
                      setFileName("")
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Blog Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
          <Checkbox
            id="isMain"
            checked={isMain}
            onCheckedChange={(checked: boolean) => setIsMain(checked === true)}
            disabled={isView}
          />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="isMain" className="text-sm font-medium cursor-pointer">
              Feature this blog post on the main page
            </Label>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          {!isView ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setTitle(initialData?.title || "")
                  setCategory(initialData?.category || "")
                  setContent(initialData?.content || "")
                  setImage(initialData?.image || null)
                  setFileName("")
                  setIsMain(initialData?.is_main === "Y")
                }}
              >
                Reset
              </Button>
              <Button onClick={handleSubmit} className="min-w-[120px]" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog Post"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onSuccess}>Close</Button>
          )}
        </div>
      </div>
    </div>
  )
}
