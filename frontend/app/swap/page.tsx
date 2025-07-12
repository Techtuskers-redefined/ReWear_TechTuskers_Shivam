"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Coins, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { itemsAPI, swapsAPI } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  pointValue: number
  images: Array<{ url: string }>
  owner: {
    _id: string
    name: string
  }
  status: "available" | "pending" | "swapped" | "removed"
  isApproved: boolean
}

interface Swap {
  _id: string
  initiator: {
    _id: string
    name: string
    avatar?: { url: string }
  }
  recipient: {
    _id: string
    name: string
    avatar?: { url: string }
  }
  offeredItem: {
    _id: string
    title: string
    images: Array<{ url: string }>
    pointValue: number
  }
  requestedItem: {
    _id: string
    title: string
    images: Array<{ url: string }>
    pointValue: number
  }
  pointDifference: number
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  message?: string
  counterOffer?: {
    pointDifference: number
    message: string
    createdAt: string
  }
  createdAt: string
}

export default function SwapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [myItems, setMyItems] = useState<Item[]>([])
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [pendingSwaps, setPendingSwaps] = useState<Swap[]>([])
  const [selectedOfferedItem, setSelectedOfferedItem] = useState<string>("")
  const [selectedRequestedItem, setSelectedRequestedItem] = useState<string>("")
  const [swapMessage, setSwapMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [swapLoading, setSwapLoading] = useState(false)
  const [pointDifference, setPointDifference] = useState(0)
  const [counterOffer, setCounterOffer] = useState({ pointDifference: 0, message: "" })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchData()
  }, [user])

  useEffect(() => {
    // Pre-select requested item from URL parameter
    const requestedItemId = searchParams.get("requestedItem")
    if (requestedItemId) {
      setSelectedRequestedItem(requestedItemId)
    }
  }, [searchParams])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      let myItemsData = []
      let availableItemsData = []
      let pendingSwapsData = []
      
      try {
        const myItemsRes = await itemsAPI.getMyItems({ status: "available" })
        myItemsData = Array.isArray(myItemsRes.data?.items) ? myItemsRes.data.items : []
      } catch (error) {
        console.error("Error fetching my items:", error)
      }
      
      try {
        const availableItemsRes = await itemsAPI.getItems({ status: "available" })
        availableItemsData = Array.isArray(availableItemsRes.data?.items) ? availableItemsRes.data.items : []
      } catch (error) {
        console.error("Error fetching available items:", error)
      }
      
      try {
        const pendingSwapsRes = await swapsAPI.getPendingSwaps()
        pendingSwapsData = Array.isArray(pendingSwapsRes.data?.swaps) ? pendingSwapsRes.data.swaps : []
      } catch (error) {
        console.error("Error fetching pending swaps:", error)
      }
      
      setMyItems(myItemsData)
      setAvailableItems(availableItemsData)
      setPendingSwaps(pendingSwapsData)
    } catch (error) {
      console.error("Error in fetchData:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedOfferedItem && selectedRequestedItem) {
      const offered = myItems.find(item => item._id === selectedOfferedItem)
      const requested = availableItems.find(item => item._id === selectedRequestedItem)
      
      if (offered && requested) {
        const difference = requested.pointValue - offered.pointValue
        setPointDifference(difference)
      }
    } else {
      setPointDifference(0)
    }
  }, [selectedOfferedItem, selectedRequestedItem, myItems, availableItems])

  const handleCreateSwap = async () => {
    if (!selectedOfferedItem || !selectedRequestedItem) {
      alert("Please select both items for the swap")
      return
    }

    try {
      setSwapLoading(true)
      await swapsAPI.createSwap({
        offeredItemId: selectedOfferedItem,
        requestedItemId: selectedRequestedItem,
        message: swapMessage,
      })

      // Reset form
      setSelectedOfferedItem("")
      setSelectedRequestedItem("")
      setSwapMessage("")
      setPointDifference(0)

      // Refresh data
      await fetchData()

      alert("Swap request created successfully!")
    } catch (error: any) {
      alert(error.message || "Failed to create swap request")
    } finally {
      setSwapLoading(false)
    }
  }

  const handleRespondToSwap = async (swapId: string, action: "accept" | "reject" | "counter") => {
    try {
      if (action === "counter") {
        await swapsAPI.respondToSwap(swapId, {
          action: "counter",
          counterOffer: {
            pointDifference: counterOffer.pointDifference,
            message: counterOffer.message,
          },
        })
      } else {
        await swapsAPI.respondToSwap(swapId, { action })
      }

      await fetchData()
      alert(`Swap ${action}ed successfully!`)
    } catch (error: any) {
      alert(error.message || `Failed to ${action} swap`)
    }
  }

  const handleRespondToCounterOffer = async (swapId: string, action: "accept" | "reject") => {
    try {
      await swapsAPI.respondToCounterOffer(swapId, action)
      await fetchData()
      alert(`Counter offer ${action}ed successfully!`)
    } catch (error: any) {
      alert(error.message || `Failed to ${action} counter offer`)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800", text: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      cancelled: { color: "bg-gray-100 text-gray-800", text: "Cancelled" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.text}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading swap page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Swap Items</h1>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Swap</TabsTrigger>
            <TabsTrigger value="pending">Pending Swaps</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Swap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* My Items */}
                  <div>
                    <Label htmlFor="offered-item">Your Item (Offering)</Label>
                    <Select value={selectedOfferedItem} onValueChange={setSelectedOfferedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item to offer" />
                      </SelectTrigger>
                      <SelectContent>
                        {myItems
                          .filter(item => item.status === "available")
                          .map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                                  <Image
                                    src={item.images && item.images.length > 0 ? item.images[0].url : "/placeholder.svg"}
                                    alt={item.title}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <span>{item.title} ({item.pointValue} pts)</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Available Items */}
                  <div>
                    <Label htmlFor="requested-item">Requested Item</Label>
                    <Select value={selectedRequestedItem} onValueChange={setSelectedRequestedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item to request" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems
                          .filter(item => item.owner._id !== user?.id && item.status === "available")
                          .map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                                  <Image
                                    src={item.images && item.images.length > 0 ? item.images[0].url : "/placeholder.svg"}
                                    alt={item.title}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <span>{item.title} ({item.pointValue} pts)</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Point Difference Display */}
                {pointDifference !== 0 && (
                  <div className={`p-4 rounded-lg border ${
                    pointDifference > 0 ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Coins className="h-5 w-5" />
                      <span className="font-medium">
                        {pointDifference > 0 
                          ? `You need to pay ${pointDifference} points`
                          : `You will receive ${Math.abs(pointDifference)} points`
                        }
                      </span>
                    </div>
                    {pointDifference > 0 && user && user.points < pointDifference && (
                      <div className="flex items-center space-x-2 mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Insufficient points. You have {user.points} points.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a message to your swap request..."
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    maxLength={500}
                  />
                </div>

                <Button 
                  onClick={handleCreateSwap}
                  disabled={!selectedOfferedItem || !selectedRequestedItem || swapLoading}
                  className="w-full"
                >
                  {swapLoading ? "Creating Swap..." : "Create Swap Request"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingSwaps.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No pending swaps</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSwaps.filter(swap => swap && swap.offeredItem && swap.requestedItem).map((swap) => (
                  <Card key={swap._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(swap.status)}
                          <span className="text-sm text-gray-600">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Offered Item */}
                        <div className="flex items-center space-x-4">
                                                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                             <Image
                               src={swap.offeredItem.images && swap.offeredItem.images.length > 0 ? swap.offeredItem.images[0].url : "/placeholder.svg"}
                               alt={swap.offeredItem.title}
                               width={64}
                               height={64}
                               className="object-cover"
                             />
                           </div>
                          <div>
                            <p className="font-medium">{swap.offeredItem.title}</p>
                            <p className="text-sm text-gray-600">{swap.offeredItem.pointValue} points</p>
                            <p className="text-sm text-gray-600">
                              {swap.initiator._id === user?.id ? "You" : swap.initiator.name}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="h-6 w-6 text-gray-400 self-center" />

                        {/* Requested Item */}
                        <div className="flex items-center space-x-4">
                                                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                             <Image
                               src={swap.requestedItem.images && swap.requestedItem.images.length > 0 ? swap.requestedItem.images[0].url : "/placeholder.svg"}
                               alt={swap.requestedItem.title}
                               width={64}
                               height={64}
                               className="object-cover"
                             />
                           </div>
                          <div>
                            <p className="font-medium">{swap.requestedItem.title}</p>
                            <p className="text-sm text-gray-600">{swap.requestedItem.pointValue} points</p>
                            <p className="text-sm text-gray-600">
                              {swap.recipient._id === user?.id ? "You" : swap.recipient.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Point Difference */}
                      {swap.pointDifference !== 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm">
                              {swap.pointDifference > 0 
                                ? `${swap.initiator.name} pays ${swap.pointDifference} points`
                                : `${swap.recipient.name} pays ${Math.abs(swap.pointDifference)} points`
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      {swap.message && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">{swap.message}</p>
                        </div>
                      )}

                      {/* Counter Offer */}
                      {swap.counterOffer && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h4 className="font-medium text-yellow-800 mb-2">Counter Offer</h4>
                          <p className="text-sm text-yellow-700 mb-2">{swap.counterOffer.message}</p>
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm">
                              {swap.counterOffer.pointDifference > 0 
                                ? `${swap.recipient.name} pays ${swap.counterOffer.pointDifference} points`
                                : `${swap.initiator.name} pays ${Math.abs(swap.counterOffer.pointDifference)} points`
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {swap.status === "pending" && (
                        <div className="mt-4 flex space-x-2">
                          {swap.recipient._id === user?.id && !swap.counterOffer ? (
                            <>
                              <Button
                                onClick={() => handleRespondToSwap(swap._id, "accept")}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleRespondToSwap(swap._id, "reject")}
                                variant="outline"
                                className="flex-1"
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleRespondToSwap(swap._id, "counter")}
                                variant="outline"
                                className="flex-1"
                              >
                                Counter Offer
                              </Button>
                            </>
                          ) : swap.initiator._id === user?.id && swap.counterOffer ? (
                            <>
                              <Button
                                onClick={() => handleRespondToCounterOffer(swap._id, "accept")}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Accept Counter
                              </Button>
                              <Button
                                onClick={() => handleRespondToCounterOffer(swap._id, "reject")}
                                variant="outline"
                                className="flex-1"
                              >
                                Reject Counter
                              </Button>
                            </>
                          ) : null}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 