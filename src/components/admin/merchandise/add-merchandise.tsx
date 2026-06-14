
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, DollarSign, Tag, ImagePlus, Shirt, Box, X } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export interface MerchandiseData {
  id?: number
  name: string
  description?: string
  category: string
  price: number
  stock: number
  size?: string[]
  status: "ACTIVE" | "INACTIVE"
  image: string
}

interface AddNewMerchandiseProps {
  mode?: "create" | "edit" | "view"
  initialData?: MerchandiseData
  onSuccess?: () => void
  onCancel?: () => void
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

export function AddNewMerchandise({ mode = "create", initialData, onSuccess, onCancel }: AddNewMerchandiseProps) {
  const [formData, setFormData] = useState<{
    name: string
    description: string
    category: string
    price: string
    stock: string
    size: string[]
    status: "ACTIVE" | "INACTIVE"
  }>({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    size: [],
    status: "ACTIVE",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isView = mode === "view"
  const isEdit = mode === "edit"

  useEffect(() => {
    if ((isEdit || isView) && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "",
        price: initialData.price?.toString() || "",
        stock: initialData.stock?.toString() || "",
        size: Array.isArray(initialData.size) ? initialData.size : [], // Ensure size is an array
        status: initialData.status || "ACTIVE",
      })
      if (initialData.image) {
        setImagePreview(initialData.image)
      }
    }
  }, [mode, initialData, isEdit, isView])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setImageFile(null)
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, size: [...prev.size, size] }
      } else {
        return { ...prev, size: prev.size.filter((s) => s !== size) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isView) return

    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        size: formData.size,
        status: formData.status,
        image: imagePreview || "",
      }

      if (isEdit && initialData?.id) {
        await api.patch(`/api/merchandise/update/${initialData.id}`, payload)
        toast.success("Merchandise updated successfully!")
      } else {
        await api.post("/api/merchandise/add", payload)
        toast.success("Merchandise added successfully!")
      }

      if (!isEdit) {
        // Reset form only on create
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          stock: "",
          size: [],
          status: "ACTIVE",
        })
        setImagePreview("")
        setImageFile(null)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving merchandise:", error)
      toast.error(`Failed to ${isEdit ? "update" : "add"} merchandise. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      size: [],
      status: "ACTIVE",
    })
    setImagePreview("")
    setImageFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {isView ? "View Merchandise" : isEdit ? "Edit Merchandise" : "Add New Merchandise"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isView
            ? "View product details"
            : isEdit
              ? "Update product details"
              : "Create a new product listing for customers to purchase"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>Product Information</span>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., SFU Party Official T-Shirt"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isView}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="resize-none"
              disabled={isView}
            />
            {!isView && <p className="text-xs text-muted-foreground">{formData.description.length} characters</p>}
          </div>
        </div>
      </div>

      {/* Category & Pricing */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span>Category & Pricing</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Apparel, Accessories"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              disabled={isView}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-9"
                min="0"
                step="0.01"
                required
                disabled={isView}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size & Inventory */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Box className="h-4 w-4 text-muted-foreground" />
          <span>Size & Inventory</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <div className="space-y-3">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_SIZES.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={formData.size.includes(size)}
                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                    disabled={isView}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              min="0"
              required
              disabled={isView}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "ACTIVE" | "INACTIVE") => setFormData({ ...formData, status: value })}
              disabled={isView}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
          <span>Product Image</span>
        </div>

        <div className="space-y-4">
          {!imagePreview ? (
            <label
              htmlFor="image-upload"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-12 transition-colors hover:border-muted-foreground/50 hover:bg-muted/30 ${isView ? 'pointer-events-none opacity-60' : ''}`}
            >
              <Shirt className="h-12 w-12 text-muted-foreground/50" />
              {!isView && (
                <>
                  <p className="mt-4 text-sm font-medium">Click to upload product image</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isView}
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-lg border bg-muted/20">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Product preview"
                className="h-64 w-full object-cover"
              />
              {!isView && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel || handleClear} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </Button>
        {!isView && (
          <>
            <Button type="button" variant="ghost" onClick={handleClear} disabled={isSubmitting}>
              Clear Form
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update Merchandise" : "Add Merchandise"}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
