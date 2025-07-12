"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ImagePlus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { itemsAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const suggestedTags = ["Vintage", "Denim", "Jacket", "Outerwear", "Blue", "Cotton", "Summer", "Casual", "Formal"]

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    gender: "",
    brand: "",
    color: "",
    material: "",
    swapPreferences: "",
  })

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload maximum 5 images")
      return
    }

    const newImages = [...selectedImages, ...files]
    setSelectedImages(newImages)

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    setSelectedImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please login to upload items")
      return
    }

    if (selectedImages.length === 0) {
      toast.error("Please select at least one image")
      return
    }

    setLoading(true)

    // Client-side validation
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!formData.description.trim()) {
      toast.error("Description is required")
      return
    }
    if (!formData.category) {
      toast.error("Category is required")
      return
    }
    if (!formData.size) {
      toast.error("Size is required")
      return
    }
    if (!formData.condition) {
      toast.error("Condition is required")
      return
    }

    try {
      const submitData = new FormData()

      // Add all form fields (including empty ones for validation)
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value || "")
      })

      // Add tags
      submitData.append("tags", selectedTags.join(","))

      // Add images
      selectedImages.forEach((image) => {
        submitData.append("images", image)
      })

      const response = await itemsAPI.createItem(submitData)

      toast.success("Item uploaded successfully! It's now pending approval.")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload item")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to upload items</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ReWear-blue/5 to-ReWear-purple/5">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-ReWear-blue to-ReWear-purple rounded"></div>
                <span className="text-xl font-bold gradient-text">ReWear</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                  Browse
                </Link>
                <Link href="/community" className="text-gray-600 hover:text-gray-900">
                  Community
                </Link>
                <Link href="/upload" className="text-ReWear-blue font-medium">
                  Upload
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar?.url || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">Upload Your Item</h1>
          <p className="text-gray-600">Share your pre-loved clothing with the community</p>

          {/* Progress Bar */}
          <div className="mb-8 mt-6">
            <div className="text-sm text-gray-600 mb-2">Step 1 of 2</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-ReWear-blue to-ReWear-purple h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium">Images *</Label>
            <div className="mt-2">
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ReWear-blue transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {selectedImages.length === 0 ? "Add photos of your item" : "Add more photos"}
                </div>
                <div className="text-gray-600 mb-4">Upload up to 5 high-quality images (JPG, PNG)</div>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Vintage Denim Jacket"
              className="mt-2"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail..."
              className="mt-2 min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-base font-medium">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="activewear">Activewear</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size and Condition Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium">Size *</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="One Size">One Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gender and Brand Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand" className="text-base font-medium">
                Brand
              </Label>
              <Input
                id="brand"
                placeholder="e.g., Zara, H&M, Vintage"
                className="mt-2"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </div>
          </div>

          {/* Color and Material Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color" className="text-base font-medium">
                Color
              </Label>
              <Input
                id="color"
                placeholder="e.g., Blue, Red, Floral"
                className="mt-2"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="material" className="text-base font-medium">
                Material
              </Label>
              <Input
                id="material"
                placeholder="e.g., Cotton, Denim, Wool"
                className="mt-2"
                value={formData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-medium">Tags</Label>
            <Input
              placeholder="Add tags to help others find your item"
              className="mt-2"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag(newTag)
                  setNewTag("")
                }
              }}
            />

            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-ReWear-blue/10 hover:border-ReWear-blue transition-colors"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1 bg-ReWear-blue text-white">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Swap Preferences */}
          <div>
            <Label htmlFor="swapPreferences" className="text-base font-medium">
              Swap Preferences (Optional)
            </Label>
            <Textarea
              id="swapPreferences"
              placeholder="What would you like to swap this for? Any specific preferences?"
              className="mt-2"
              value={formData.swapPreferences}
              onChange={(e) => handleInputChange("swapPreferences", e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-ReWear-blue to-ReWear-purple hover:from-ReWear-blue/90 hover:to-ReWear-purple/90 text-white py-3 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}