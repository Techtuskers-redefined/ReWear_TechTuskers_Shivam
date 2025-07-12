"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { itemsAPI } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  tags: string[]
  images: Array<{ url: string }>
  owner: {
    _id: string
    name: string
    avatar?: { url: string }
  }
  isAvailable: boolean
  createdAt: string
}

interface RelatedItem {
  _id: string
  title: string
  size: string
  images: Array<{ url: string }>
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemId = params.id as string

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true)
        const response = await itemsAPI.getItem(itemId)
        setItem(response.data.item)
        
        // Fetch related items from the same category
        if (response.data.item.category) {
          const relatedResponse = await itemsAPI.getItems({ 
            category: response.data.item.category,
            limit: 3,
            exclude: itemId
          })
          setRelatedItems(relatedResponse.data.items || [])
        }
      } catch (err) {
        console.error("Error fetching item details:", err)
        setError("Failed to load item details")
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      fetchItemDetails()
    }
  }, [itemId])

  const handleRequestSwap = () => {
    if (!user) {
      router.push("/login")
      return
    }
    // TODO: Implement swap request functionality
    console.log("Request swap for item:", itemId)
  }

  const handleRedeemWithPoints = () => {
    if (!user) {
      router.push("/login")
      return
    }
    // TODO: Implement points redemption functionality
    console.log("Redeem item with points:", itemId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Item not found"}</p>
          <Link href="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-swapit-blue to-swapit-purple rounded"></div>
                <span className="text-xl font-bold gradient-text">SwapIt</span>
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
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  Submit
                </Link>
                <Link href="/community" className="text-gray-600 hover:text-gray-900">
                  Community
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar?.url || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{user ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/browse" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div>
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={item.images?.[0]?.url || "/placeholder.svg?height=400&width=400"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.owner?.avatar?.url || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>{item.owner?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{item.owner?.name}</div>
                  <div className="text-sm text-gray-600">Uploaded {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-medium">{item.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Size</div>
                  <div className="font-medium">{item.size}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Condition</div>
                  <div className="font-medium">{item.condition}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags?.map((tag, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex gap-4 mb-6">
                <Link href={`/swap?requestedItem=${item._id}`} className="flex-1">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={!item.isAvailable}
                  >
                    Swap for this Item
                  </Button>
                </Link>
                <Button 
                  onClick={handleRedeemWithPoints}
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  disabled={!item.isAvailable}
                >
                  Redeem with Points
                </Button>
              </div>

              <div className={`border rounded-lg p-3 ${
                item.isAvailable 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className={`text-sm font-medium ${
                  item.isAvailable ? "text-green-800" : "text-red-800"
                }`}>
                  {item.isAvailable ? "Available" : "Not Available"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedItems.map((relatedItem) => (
                <Link key={relatedItem._id} href={`/item/${relatedItem._id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        <Image 
                          src={relatedItem.images?.[0]?.url || "/placeholder.svg"} 
                          alt={relatedItem.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{relatedItem.title}</h3>
                        <p className="text-sm text-gray-600">{relatedItem.size}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
