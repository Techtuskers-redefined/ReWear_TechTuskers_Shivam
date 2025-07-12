import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

const items = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    tags: ["#Casual", "#WinterWear"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 2,
    title: "Cozy Knit Sweater",
    tags: ["#Cozy", "#Autumn"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 3,
    title: "Sustainable Cotton Tee",
    tags: ["#Sustainable", "#Everyday"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 4,
    title: "Classic Leather Boots",
    tags: ["#Classic", "#Durable"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 5,
    title: "Boho Maxi Dress",
    tags: ["#Boho", "#Summer"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 6,
    title: "Upcycled Denim Shorts",
    tags: ["#Upcycled", "#Denim"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 7,
    title: "Recycled Polyester Leggings",
    tags: ["#Recycled", "#Activewear"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 8,
    title: "Organic Linen Shirt",
    tags: ["#Organic", "#Comfort"],
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 9,
    title: "Handmade Beaded Necklace",
    tags: ["#Handmade", "#Unique"],
    image: "/placeholder.svg?height=300&width=250",
  },
]

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="bottoms">Bottoms</SelectItem>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">Like New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="swapped">Swapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold gradient-text">Browse Items</h1>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-swapit-blue text-swapit-blue hover:bg-swapit-blue hover:text-white bg-transparent"
              >
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative h-64">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}