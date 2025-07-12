"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Star, Edit, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { itemsAPI } from "@/lib/api"

const userItems = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    image: "/placeholder.svg?height=200&width=200",
    status: "Available",
    likes: 12,
  },
  {
    id: 2,
    title: "Designer Silk Dress",
    image: "/placeholder.svg?height=200&width=200",
    status: "Swapped",
    likes: 8,
  },
  {
    id: 3,
    title: "Cashmere Sweater",
    image: "/placeholder.svg?height=200&width=200",
    status: "Available",
    likes: 15,
  },
  {
    id: 4,
    title: "Denim Jeans",
    image: "/placeholder.svg?height=200&width=200",
    status: "Pending",
    likes: 6,
  },
]

const reviews = [
  {
    id: 1,
    reviewer: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    comment: "Amazing swapper! The item was exactly as described and in perfect condition.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    reviewer: "Michael Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    comment: "Quick response and smooth transaction. Highly recommend!",
    date: "1 month ago",
  },
  {
    id: 3,
    reviewer: "Sarah Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    rating: 4,
    comment: "Great communication throughout the swap process.",
    date: "2 months ago",
  },
]

const badges = [
  { name: "Eco Warrior", icon: "🌱", description: "Saved 50+ items from landfill" },
  { name: "Vintage Finder", icon: "👗", description: "Expert at finding vintage pieces" },
  { name: "Community Star", icon: "⭐", description: "Top-rated swapper" },
  { name: "Trendsetter", icon: "✨", description: "Always ahead of fashion trends" },
]

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [userItems, setUserItems] = useState([])
  const [userStats, setUserStats] = useState({
    itemsListed: 0,
    successfulSwaps: 0,
    rating: 0,
    pointsEarned: 0
  })

  console.log("Profile page - user:", user)
  console.log("Profile page - loading:", loading)

  useEffect(() => {
    if (user) {
      // Fetch user's items
      const fetchUserItems = async () => {
        try {
          const response = await itemsAPI.getMyItems()
          setUserItems(response.data?.items || [])
        } catch (error) {
          console.error("Error fetching user items:", error)
        }
      }

      fetchUserItems()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swapit-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar?.url || "/placeholder.svg?height=96&width=96"} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Member since {new Date().getFullYear()}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Link href="/dashboard/settings">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">
                  Passionate about sustainable fashion and helping others discover the joy of swapping! Love vintage
                  finds and unique pieces with stories to tell. 🌱✨
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{userItems.length}</div>
                    <div className="text-sm text-gray-600">Items Listed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{userStats.successfulSwaps}</div>
                    <div className="text-sm text-gray-600">Successful Swaps</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-2xl font-bold text-gray-900">{userStats.rating || "N/A"}</span>
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.points || 0}</div>
                    <div className="text-sm text-gray-600">Points Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <div className="font-medium text-gray-900 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">My Items</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            {userItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 mb-4">No items listed yet</div>
                  <Link href="/upload">
                    <Button>Upload Your First Item</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {userItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={item.images?.[0]?.url || "/placeholder.svg"}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${
                            item.status === "available"
                              ? "bg-green-100 text-green-800"
                              : item.status === "swapped"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-1" />
                          {item.likes?.length || 0} likes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.reviewer}</h4>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">Activity feed coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
