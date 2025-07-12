"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    // Redirect to home page after logout
    window.location.href = "/"
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-swapit-blue to-swapit-purple rounded"></div>
              <span className="text-xl font-bold gradient-text">SwapIt</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-900 hover:text-gray-700 font-medium">
                Home
              </Link>
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                Submit
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search" className="pl-10 w-64 bg-gray-100 border-0" />
            </div>
            {user && <NotificationDropdown/>}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user?.avatar?.url || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}