import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, RefreshCw, Coins, User, Settings, MessageCircle, Check, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const sidebarItems = [
  { icon: Package, label: "My Items", href: "/dashboard" },
  { icon: RefreshCw, label: "My Swaps", href: "/dashboard/swaps", active: true },
  { icon: Coins, label: "Points Wallet", href: "/dashboard/points" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const incomingRequests = [
  {
    id: 1,
    requester: "Emma Wilson",
    requesterAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Vintage Leather Jacket",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Designer Silk Dress",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    date: "2 hours ago",
    message: "Hi! I love your leather jacket. Would you be interested in swapping for my silk dress?",
  },
  {
    id: 2,
    requester: "Marcus Chen",
    requesterAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Cashmere Sweater",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Wool Coat",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    date: "5 hours ago",
    message: "Your sweater would be perfect for my collection. Interested in my wool coat?",
  },
]

const outgoingRequests = [
  {
    id: 1,
    recipient: "Sofia Rodriguez",
    recipientAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Denim Jeans",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Boho Maxi Dress",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    status: "Pending",
    date: "1 day ago",
  },
  {
    id: 2,
    recipient: "Alex Thompson",
    recipientAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Sneakers",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Leather Boots",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    status: "Accepted",
    date: "3 days ago",
  },
]

const completedSwaps = [
  {
    id: 1,
    partner: "Riley Davis",
    partnerAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Summer Dress",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Vintage Blazer",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    date: "1 week ago",
    rating: 5,
  },
  {
    id: 2,
    partner: "Jordan Kim",
    partnerAvatar: "/placeholder.svg?height=40&width=40",
    myItem: "Handbag",
    myItemImage: "/placeholder.svg?height=80&width=80",
    theirItem: "Scarf Collection",
    theirItemImage: "/placeholder.svg?height=80&width=80",
    date: "2 weeks ago",
    rating: 4,
  },
]

export default function MySwapsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200 hidden lg:block">
          <div className="p-6">
            <Link href="/" className="text-xl font-bold text-gray-900">
              ReWear
            </Link>
          </div>

          <nav className="px-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
            <p className="text-gray-600">Manage your swap requests and track your exchanges</p>
          </div>

          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incoming">Incoming ({incomingRequests.length})</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing ({outgoingRequests.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedSwaps.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="incoming" className="mt-6 space-y-4">
              {incomingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={request.requesterAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{request.requester[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.requester}</h3>
                          <p className="text-sm text-gray-500">{request.date}</p>
                        </div>
                      </div>

                      {/* Swap Items */}
                      <div className="flex-1 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={request.myItemImage || "/placeholder.svg"}
                            alt={request.myItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Your Item</p>
                            <p className="text-sm text-gray-600">{request.myItem}</p>
                          </div>
                        </div>

                        <div className="text-gray-400">
                          <RefreshCw className="h-5 w-5" />
                        </div>

                        <div className="flex items-center space-x-3">
                          <Image
                            src={request.theirItemImage || "/placeholder.svg"}
                            alt={request.theirItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Their Item</p>
                            <p className="text-sm text-gray-600">{request.theirItem}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">"{request.message}"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="outgoing" className="mt-6 space-y-4">
              {outgoingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={request.recipientAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{request.recipient[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.recipient}</h3>
                          <p className="text-sm text-gray-500">{request.date}</p>
                        </div>
                      </div>

                      {/* Swap Items */}
                      <div className="flex-1 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={request.myItemImage || "/placeholder.svg"}
                            alt={request.myItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Your Item</p>
                            <p className="text-sm text-gray-600">{request.myItem}</p>
                          </div>
                        </div>

                        <div className="text-gray-400">
                          <RefreshCw className="h-5 w-5" />
                        </div>

                        <div className="flex items-center space-x-3">
                          <Image
                            src={request.theirItemImage || "/placeholder.svg"}
                            alt={request.theirItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Their Item</p>
                            <p className="text-sm text-gray-600">{request.theirItem}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            request.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {request.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="mt-6 space-y-4">
              {completedSwaps.map((swap) => (
                <Card key={swap.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={swap.partnerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{swap.partner[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{swap.partner}</h3>
                          <p className="text-sm text-gray-500">{swap.date}</p>
                        </div>
                      </div>

                      {/* Swap Items */}
                      <div className="flex-1 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={swap.myItemImage || "/placeholder.svg"}
                            alt={swap.myItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">You Gave</p>
                            <p className="text-sm text-gray-600">{swap.myItem}</p>
                          </div>
                        </div>

                        <div className="text-gray-400">
                          <RefreshCw className="h-5 w-5" />
                        </div>

                        <div className="flex items-center space-x-3">
                          <Image
                            src={swap.theirItemImage || "/placeholder.svg"}
                            alt={swap.theirItem}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">You Received</p>
                            <p className="text-sm text-gray-600">{swap.theirItem}</p>
                          </div>
                        </div>
                      </div>

                      {/* Rating & Actions */}
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        <Button variant="outline" size="sm">
                          Rate Swap
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
