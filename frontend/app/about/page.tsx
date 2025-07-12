import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Recycle, Users, Leaf, Heart, Award, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Passionate about sustainable fashion and environmental impact.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of Technology",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Building the platform that makes sustainable swapping seamless.",
  },
  {
    name: "Emma Thompson",
    role: "Community Manager",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Fostering connections and building our amazing swapper community.",
  },
  {
    name: "Alex Kim",
    role: "Head of Design",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Creating beautiful experiences that inspire sustainable choices.",
  },
]

const stats = [
  { icon: Users, label: "Active Swappers", value: "50,000+" },
  { icon: Recycle, label: "Items Swapped", value: "200,000+" },
  { icon: Leaf, label: "CO2 Saved", value: "150 tons" },
  { icon: Globe, label: "Countries", value: "25+" },
]

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description: "Every swap reduces fashion waste and helps protect our planet for future generations.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We believe in the power of community to create positive change and meaningful connections.",
  },
  {
    icon: Heart,
    title: "Inclusive Fashion",
    description: "Fashion should be accessible to everyone, regardless of budget or background.",
  },
  {
    icon: Award,
    title: "Quality & Trust",
    description: "We maintain high standards to ensure every swap is safe, fair, and satisfying.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">About ReWear</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to revolutionize fashion consumption by making clothing swaps accessible, enjoyable, and
            impactful for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Start Swapping
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ReWear was born from a simple observation: our closets are full of clothes we rarely wear, while the
                  fashion industry continues to be one of the world's largest polluters.
                </p>
                <p>
                  Founded in 2024, we started with a vision to create a platform where fashion lovers could refresh
                  their wardrobes sustainably, connect with like-minded individuals, and make a positive impact on the
                  environment.
                </p>
                <p>
                  Today, we're proud to be part of a growing movement that's changing how people think about fashion
                  consumption, one swap at a time.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Our story"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <value.icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-blue-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Movement?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your sustainable fashion journey today and become part of our growing community.
          </p>
          <Link href="/upload">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
