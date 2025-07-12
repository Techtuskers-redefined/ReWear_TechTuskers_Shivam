"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, RefreshCw, Heart, MessageCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "swap_request",
    title: "New swap request",
    message: "Emma Wilson wants to swap for your vintage jacket",
    time: "2 minutes ago",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    type: "swap_accepted",
    title: "Swap accepted!",
    message: "Marcus Chen accepted your swap request",
    time: "1 hour ago",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    type: "like",
    title: "Item liked",
    message: "Sofia Rodriguez liked your cashmere sweater",
    time: "3 hours ago",
    unread: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    type: "message",
    title: "New message",
    message: "Alex Thompson sent you a message about the denim jacket",
    time: "5 hours ago",
    unread: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    type: "swap_completed",
    title: "Swap completed",
    message: "Your swap with Riley Davis has been completed",
    time: "1 day ago",
    unread: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "swap_request":
    case "swap_accepted":
    case "swap_completed":
      return <RefreshCw className="h-4 w-4 text-blue-500" />
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "message":
      return <MessageCircle className="h-4 w-4 text-green-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

export function NotificationDropdown() {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-0">
              <div className={`w-full p-3 hover:bg-gray-50 ${notification.unread ? "bg-blue-50" : ""}`}>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{notification.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                      {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          <Button variant="ghost" className="w-full text-sm">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}