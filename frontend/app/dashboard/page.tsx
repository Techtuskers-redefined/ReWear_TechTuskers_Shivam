import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, RefreshCw, Coins, User, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const myItems = [
  {
    id: 1,
    image: "/placeholder.svg?height=80&width=80",
    status: "Listed",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=80&width=80",
    status: "Listed",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=80&width=80",
    status: "Listed",
  },
]

const swapHistory = [
  {
    id: 1,
    image: "/placeholder.svg?height=80&width=80",
    status: "Pending",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=80&width=80",
    status: "Accepted",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=80&width=80",
    status: "Completed",
  },
]

const sidebarItems = [
  { icon: Package, label: "My Items", href: "/dashboard", active: true },
  { icon: RefreshCw, label: "My Swaps", href: "/dashboard/swaps" },
  { icon: Coins, label: "Points Wallet", href: "/dashboard/points" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200">
          <div className="p-6">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SwapIt
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
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Items Listed</div>
                  <div className="text-3xl font-bold text-gray-900">12</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Points Earned</div>
                  <div className="text-3xl font-bold text-gray-900">250</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Swaps Completed</div>
                  <div className="text-3xl font-bold text-gray-900">5</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Items */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Items</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt="Item"
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className="bg-gray-100 text-gray-800">{item.status}</Badge>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Swap History */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Swap History</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swapHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt="Item"
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge
                            className={
                              item.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "Accepted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
