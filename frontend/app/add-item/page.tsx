"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus, Camera } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Activewear",
  "Formal",
  "Casual",
  "Vintage",
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]
const conditions = ["Like New", "Excellent", "Very Good", "Good", "Fair"]

export default function AddItem() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Add New Item</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>List Your Item</CardTitle>
            <p className="text-slate-600">Fill in the details below to list your item for swapping</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-base font-semibold">Photos</Label>
              <p className="text-sm text-slate-600 mb-4">Add up to 5 photos of your item</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Upload Box */}
                <div className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600">Add Photo</span>
                </div>

                {/* Placeholder for uploaded images */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square border border-slate-200 rounded-lg bg-slate-100"></div>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Item Title *</Label>
                <Input id="title" placeholder="e.g., Vintage Denim Jacket" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="size">Size *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size.toLowerCase()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition.toLowerCase()}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail. Include brand, material, fit, and any flaws..."
                className="mt-1 min-h-[120px]"
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="text-base font-semibold">Tags</Label>
              <p className="text-sm text-slate-600 mb-3">Add tags to help others find your item</p>

              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a tag (e.g., vintage, designer, casual)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Preferences */}
            <div>
              <Label className="text-base font-semibold">Swap Preferences (Optional)</Label>
              <p className="text-sm text-slate-600 mb-3">What are you looking for in return?</p>
              <Textarea
                placeholder="e.g., Looking for similar size tops, dresses, or accessories..."
                className="min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
              <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                <Upload className="h-4 w-4 mr-2" />
                Submit Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
