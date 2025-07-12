import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Users, TrendingUp, Award } from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"

const communityPosts = [
  {
    id: 1,
    user: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2 hours ago",
    content:
      "Just completed my 10th swap! This vintage leather jacket is absolutely perfect. The ReWear community never disappoints! 💚",
    image: "/placeholder.svg?height=300&width=400",
    likes: 24,
    comments: 8,
    tags: ["#vintage", "#leather", "#sustainable"],
  },
  {
    id: 2,
    user: "Marcus Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "4 hours ago",
    content:
      "Hosting a local swap meet this weekend in downtown! Who's interested? Let's make fashion more sustainable together 🌱",
    likes: 18,
    comments: 12,
    tags: ["#swapmeet", "#local", "#community"],
  },
  {
    id: 3,
    user: "Sofia Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "6 hours ago",
    content: "Before and after of my closet transformation using ReWear! From fast fashion to sustainable style ✨",
    image: "/placeholder.svg?height=300&width=400",
    likes: 45,
    comments: 15,
    tags: ["#transformation", "#sustainable", "#closet"],
  },
]

const topSwappers = [
  { name: "Alex Thompson", swaps: 47, points: 2340, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Maya Patel", swaps: 42, points: 2180, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Jordan Kim", swaps: 38, points: 1950, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Riley Davis", swaps: 35, points: 1820, avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Casey Brown", swaps: 32, points: 1650, avatar: "/placeholder.svg?height=32&width=32" },
]

const challenges = [
  {
    title: "30-Day Swap Challenge",
    description: "Complete 5 swaps in 30 days",
    progress: 60,
    reward: "500 bonus points",
    participants: 234,
  },
  {
    title: "Vintage Finder",
    description: "Find and swap 3 vintage items",
    progress: 33,
    reward: "Vintage badge",
    participants: 156,
  },
  {
    title: "Eco Warrior",
    description: "Save 10 items from landfill",
    progress: 80,
    reward: "Eco badge + 300 points",
    participants: 89,
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow swappers and share your sustainable fashion journey</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-6 space-y-6">
                {communityPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar>
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{post.user}</h3>
                            <span className="text-sm text-gray-500">{post.time}</span>
                          </div>
                          <p className="text-gray-700 mt-2">{post.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {post.image && (
                        <div className="mb-4">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="challenges" className="mt-6 space-y-6">
                {challenges.map((challenge, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{challenge.title}</h3>
                          <p className="text-gray-600 text-sm">{challenge.description}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{challenge.participants} joined</Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Reward: <span className="font-medium text-gray-900">{challenge.reward}</span>
                        </div>
                        <Button size="sm" className="btn-primary">
                          Join Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500 mb-4">No upcoming events</div>
                    <Button className="btn-secondary">Create Event</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Members</span>
                    <span className="font-semibold">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Swapped</span>
                    <span className="font-semibold">45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CO2 Saved</span>
                    <span className="font-semibold">2.3 tons</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Swappers */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Top Swappers
                </h3>
                <div className="space-y-3">
                  {topSwappers.map((swapper, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={swapper.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{swapper.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{swapper.name}</p>
                        <p className="text-xs text-gray-500">
                          {swapper.swaps} swaps • {swapper.points} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#vintage",
                    "#sustainable",
                    "#denim",
                    "#designer",
                    "#boho",
                    "#minimalist",
                    "#streetwear",
                    "#formal",
                  ].map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
