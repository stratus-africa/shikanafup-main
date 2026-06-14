
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/axios"
import { toast, Toaster } from "react-hot-toast"

type UpdateBlogProps = {
  blogId: number
  onSuccess?: () => void
}

export default function UpdateBlog({ blogId, onSuccess }: UpdateBlogProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isMain, setIsMain] = useState(false)
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await api.get(`/api/blog/${blogId}`)
        const blog = res.data?.data
        setTitle(blog.title)
        setCategory(blog.category)
        setContent(blog.content)
        setImage(blog.image)
        setIsMain(blog.isMain === "Y")
      } catch (err) {
        toast.error("Failed to fetch blog")
      }
    }
    fetchBlog()
    // getCategory()
  }, [blogId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpdate = async () => {
    if (!title || !category || !content || !image) {
      toast.error("All fields are required")
      return
    }
    try {
      const blogData = { title, category, content, image, isMain: isMain ? "Y" : "N" }
      const response = await api.put(`/api/blog/update/${blogId}`, blogData)
      if (response.data?.statusCode === 200) {
        toast.success(response.data?.message)
        onSuccess?.()
      } else {
        toast.error(response.data?.message)
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="w-full mt-2">
      <Toaster position="top-right" />
      <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryData.map((data, idx) => <SelectItem value={data.category} key={idx}>{data.category}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="isMain" checked={isMain} onCheckedChange={(checked: boolean) => setIsMain(checked === true)} />
          <Label htmlFor="isMain">Main Blog</Label>
        </div>
        <div className="md:col-span-2">
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </CardContent>
    </Card>
  )
}
