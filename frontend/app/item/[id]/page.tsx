import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const relatedItems = [
  {
    id: 1,
    title: "Boho Maxi Dress",
    size: "Size S",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Leather Ankle Boots",
    size: "Size 7",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "Cashmere Sweater",
    size: "Size M",
    image: "/placeholder.svg?height=200&width=150",
  },
]

export default function ItemDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black rounded"></div>
                <span className="text-xl font-bold text-gray-900">ReWear</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/shop" className="text-gray-600 hover:text-gray-900">
                  Shop
                </Link>
                <Link href="/swap" className="text-gray-600 hover:text-gray-900">
                  Swap
                </Link>
                <Link href="/community" className="text-gray-600 hover:text-gray-900">
                  Community
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div>
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-12%20at%2010.52.07-jrJeMkEUexN6leIYidh7oHGAItm1zc.png"
                alt="Vintage Denim Jacket"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Vintage Denim Jacket</h1>

              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>SG</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">Sophia Green</div>
                  <div className="text-sm text-gray-600">Uploaded by @eco_fashionista</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-medium">Outerwear</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Size</div>
                  <div className="font-medium">M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Condition</div>
                  <div className="font-medium">Excellent</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-blue-100 text-blue-800">Sustainable</Badge>
                <Badge className="bg-green-100 text-green-800">Vintage</Badge>
                <Badge className="bg-purple-100 text-purple-800">Denim</Badge>
                <Badge className="bg-orange-100 text-orange-800">Jacket</Badge>
                <Badge className="bg-gray-100 text-gray-800">Outerwear</Badge>
                <Badge className="bg-indigo-100 text-indigo-800">Blue</Badge>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  This classic denim jacket is in excellent condition and perfect for layering. It's a timeless piece
                  that adds a touch of vintage charm to any outfit. Made from high-quality denim, it's durable and
                  stylish.
                </p>
              </div>

              <div className="flex gap-4 mb-6">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">Request Swap</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Redeem with Points
                </Button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm font-medium text-green-800">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.size}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
