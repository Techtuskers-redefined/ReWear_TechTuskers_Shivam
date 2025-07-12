import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, RefreshCw, Coins, User, Settings, TrendingUp, Gift, Star, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const sidebarItems = [
  { icon: Package, label: "My Items", href: "/dashboard" },
  { icon: RefreshCw, label: "My Swaps", href: "/dashboard/swaps" },
  { icon: Coins, label: "Points Wallet", href: "/dashboard/points", active: true },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const pointsHistory = [
  { id: 1, action: "Item swap completed", points: "+50", date: "2 days ago", type: "earned" },
  { id: 2, action: "Redeemed vintage dress", points: "-200", date: "1 week ago", type: "spent" },
  { id: 3, action: "Item swap completed", points: "+50", date: "1 week ago", type: "earned" },
  { id: 4, action: "Daily login bonus", points: "+5", date: "2 weeks ago", type: "earned" },
  { id: 5, action: "Profile completion bonus", points: "+25", date: "3 weeks ago", type: "earned" },
  { id: 6, action: "Redeemed designer bag", points: "-150", date: "1 month ago", type: "spent" },
]

const rewardItems = [
  {
    id: 1,
    title: "Designer Handbag",
    points: 500,
    image: "/placeholder.svg?height=150&width=150",
    category: "Premium",
  },
  {
    id: 2,
    title: "Vintage Leather Jacket",
    points: 300,
    image: "/placeholder.svg?height=150&width=150",
    category: "Vintage",
  },
  {
    id: 3,
    title: "Silk Scarf Set",
    points: 200,
    image: "/placeholder.svg?height=150&width=150",
    category: "Accessories",
  },
  {
    id: 4,
    title: "Cashmere Sweater",
    points: 400,
    image: "/placeholder.svg?height=150&width=150",
    category: "Premium",
  },
]

const achievements = [
  { title: "First Swap", description: "Complete your first swap", points: 25, completed: true },
  { title: "Eco Warrior", description: "Complete 10 swaps", points: 100, completed: true },
  { title: "Community Star", description: "Get 50 likes on your items", points: 75, completed: false, progress: 32 },
  { title: "Vintage Collector", description: "Swap 5 vintage items", points: 150, completed: false, progress: 3 },
]

export default function PointsWalletPage() {
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Points Wallet</h1>
            <p className="text-gray-600">Manage your ReWear points and redeem rewards</p>
          </div>

          {/* Points Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                    <p className="text-3xl font-bold text-blue-600">2,340</p>
                    <p className="text-sm text-gray-500">ReWear Points</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Coins className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Points Earned</p>
                    <p className="text-3xl font-bold text-green-600">3,450</p>
                    <p className="text-sm text-gray-500">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Points Spent</p>
                    <p className="text-3xl font-bold text-purple-600">1,110</p>
                    <p className="text-sm text-gray-500">On rewards</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Points History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointsHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                      <div className={`font-semibold ${item.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                        {item.points}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All History
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">+{achievement.points}</Badge>
                          {achievement.completed && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Star className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      {!achievement.completed && achievement.progress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/50</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(achievement.progress / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reward Store */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Reward Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {rewardItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="relative mb-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-gray-800">{item.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600">
                        <Coins className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{item.points}</span>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600" disabled={item.points > 2340}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button variant="outline">View All Rewards</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
