"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Upload, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const suggestedTags = ["Vintage", "Denim", "Jacket", "Outerwear", "Blue"]

export default function UploadPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black rounded"></div>
                <span className="text-xl font-bold text-gray-900">Wardrobe Swap</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                  Explore
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How it Works
                </Link>
                <Link href="/community" className="text-gray-600 hover:text-gray-900">
                  Community
                </Link>
                <Link href="/upload" className="text-gray-900 font-medium">
                  Upload
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Item</h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2">Step 1 of 5</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Vintage Denim Jacket"
              className="mt-2"
              defaultValue="Vintage Denim Jacket"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Description
            </Label>
            <Textarea id="description" placeholder="Describe your item..." className="mt-2 min-h-[100px]" />
          </div>

          {/* Category */}
          <div>
            <Label className="text-base font-medium">Category</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-medium">Tags</Label>
            <Input
              placeholder="Add tags (e.g., vintage, denim, jacket)"
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
                  className="cursor-pointer hover:bg-gray-100"
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
                  <Badge key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Condition */}
          <div>
            <Label className="text-base font-medium">Condition</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div>
            <Label className="text-base font-medium">Size</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-base font-medium">Gender</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium">Images</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">Drag and drop images here</div>
              <div className="text-gray-600 mb-4">Or click to upload</div>
              <Button variant="outline">Upload Images</Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg">Upload</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
