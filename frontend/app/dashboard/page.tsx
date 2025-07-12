"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, RefreshCw, Coins, User, Settings, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { itemsAPI, swapsAPI } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

interface UserItem {
  _id: string
  title: string
  category: string
  size: string
  condition: string
  images: Array<{ url: string }>
  isAvailable: boolean
  isApproved: boolean
  createdAt: string
}

interface SwapHistory {
  _id: string
  item: {
    _id: string
    title: string
    images: Array<{ url: string }>
  }
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
}

interface UserStats {
  itemsListed: number
  pointsEarned: number
  swapsCompleted: number
}

const sidebarItems = [
  { icon: Package, label: "My Items", href: "/dashboard", active: true },
  { icon: RefreshCw, label: "My Swaps", href: "/dashboard/swaps" },
  { icon: Coins, label: "Points Wallet", href: "/dashboard/points" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [myItems, setMyItems] = useState<UserItem[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [stats, setStats] = useState<UserStats>({
    itemsListed: 0,
    pointsEarned: 0,
    swapsCompleted: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch user's items
        const itemsResponse = await itemsAPI.getMyItems()
        setMyItems(itemsResponse.data.items || [])
        
        // Fetch swap history
        const swapsResponse = await swapsAPI.getSwapHistory()
        setSwapHistory(swapsResponse.data.swaps || [])
        
        // Calculate stats
        const completedSwaps = swapsResponse.data.swaps?.filter(
          (swap: SwapHistory) => swap.status === "completed"
        ).length || 0
        
        setStats({
          itemsListed: itemsResponse.data.items?.length || 0,
          pointsEarned: user?.points || 0,
          swapsCompleted: completedSwaps
        })
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await itemsAPI.deleteItem(itemId)
        setMyItems(prev => prev.filter(item => item._id !== itemId))
        setStats(prev => ({ ...prev, itemsListed: prev.itemsListed - 1 }))
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200">
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
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Items Listed</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.itemsListed}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Points Earned</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.pointsEarned}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Swaps Completed</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.swapsCompleted}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Items */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
                <Link href="/upload">
                  <Button size="sm">Add New Item</Button>
                </Link>
              </div>

              {myItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't listed any items yet.</p>
                  <Link href="/upload">
                    <Button>Upload Your First Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Category</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Size</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myItems.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={item.images?.[0]?.url || "/placeholder.svg"}
                                  alt={item.title}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-600">{item.condition}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-gray-900">{item.size}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Badge className={item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {item.isAvailable ? "Available" : "Not Available"}
                              </Badge>
                              <Badge className={item.isApproved ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                                {item.isApproved ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Link href={`/item/${item._id}`}>
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  View
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-gray-600">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Swap History */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Swap History</h2>

              {swapHistory.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No swap history yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swapHistory.filter(swap => swap && swap.item).map((swap) => (
                        <tr key={swap._id} className="border-b border-gray-100">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={swap.item?.images?.[0]?.url || "/placeholder.svg"}
                                  alt={swap.item?.title || "Unknown Item"}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{swap.item?.title || "Unknown Item"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge className={getStatusBadgeColor(swap.status)}>
                              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-gray-600">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
