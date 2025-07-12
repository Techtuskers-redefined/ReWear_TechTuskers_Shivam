import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const submissions = [
  {
    id: 1,
    item: "/placeholder.svg?height=60&width=60",
    user: "Sophia Clark",
    date: "2024-07-26",
    status: "Pending",
  },
  {
    id: 2,
    item: "/placeholder.svg?height=60&width=60",
    user: "Ethan Miller",
    date: "2024-07-25",
    status: "Approved",
  },
  {
    id: 3,
    item: "/placeholder.svg?height=60&width=60",
    user: "Olivia Davis",
    date: "2024-07-24",
    status: "Rejected",
  },
  {
    id: 4,
    item: "/placeholder.svg?height=60&width=60",
    user: "Noah Wilson",
    date: "2024-07-23",
    status: "Pending",
  },
  {
    id: 5,
    item: "/placeholder.svg?height=60&width=60",
    user: "Ava Taylor",
    date: "2024-07-22",
    status: "Approved",
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black rounded"></div>
                <span className="text-xl font-bold text-gray-900">SwapIt</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                  Browse
                </Link>
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  Submit
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
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submissions</h1>
          <p className="text-gray-600">Review and moderate item submissions from users.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search submissions" className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="moderation">User Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Item</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">User</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={submission.item || "/placeholder.svg"}
                                alt="Item"
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{submission.user}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-600">{submission.date}</div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              className={
                                submission.status === "Pending"
                                  ? "bg-gray-100 text-gray-800"
                                  : submission.status === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-600">
                                Approve
                              </Button>
                              <span className="text-gray-400">|</span>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">User moderation features coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
