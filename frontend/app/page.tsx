import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

const featuredSwaps = [
  {
    id: 1,
    title: "Vintage Floral Dress",
    category: "Dresses",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 2,
    title: "Casual Streetwear Set",
    category: "Men's Fashion",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 3,
    title: "Retro Trench Coat",
    category: "Outerwear",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 4,
    title: "Classic Business Suit",
    category: "Men's Formal",
    image: "/placeholder.svg?height=300&width=200",
  },
]

const testimonials = [
  {
    name: "Sophia Bennett",
    quote:
      "I've found so many unique pieces that I wouldn't have discovered otherwise. It's like a treasure hunt, but sustainable!",
    avatar: "/placeholder.svg?height=150&width=150",
    bg: "bg-orange-200",
  },
  {
    name: "Ethan Carter",
    quote:
      "ReWear has completely changed my shopping habits. I can refresh my wardrobe without spending a fortune, and I'm helping the environment at the same time.",
    avatar: "/placeholder.svg?height=150&width=150",
    bg: "bg-blue-200",
  },
  {
    name: "Olivia Harper",
    age: "Age 35",
    quote:
      "The community is amazing! I've connected with so many like-minded fashion lovers, and it's great to see my clothes going to a good home.",
    avatar: "/placeholder.svg?height=150&width=150",
    bg: "bg-pink-200",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative rounded-2xl overflow-hidden bg-gray-300 h-96">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-12%20at%2010.48.04-Sehe5HGJQNqXqEbVaxLc8ECw9L7lTd.png"
              alt="Hero background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-8">
              <h1 className="text-4xl font-bold mb-4 sm:text-5xl lg:text-6xl">Swap Your Style. Save the Planet.</h1>
              <p className="text-lg mb-8 max-w-2xl">
                Join a community of fashion lovers who are changing the way we consume clothing. Swap your pre-loved
                items for new-to-you treasures, earn points, and reduce fashion waste.
              </p>
              <div className="flex gap-4">
                <Link href="/browse">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                    Start Swapping
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="secondary" className="bg-white text-gray-900 px-8">
                    Browse Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Swaps */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Swaps</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredSwaps.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-gray-50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Swap, Earn, and Refresh Your Wardrobe</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to exchange your clothes for new styles. Here's how it works:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Items</h3>
              <p className="text-gray-600">
                Take photos of the clothes you want to swap and upload them to your profile. Provide details like size,
                condition, and style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Swap with Others</h3>
              <p className="text-gray-600">
                Browse items from other users and request swaps. Once a swap is agreed upon, exchange the items.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Earn Points</h3>
              <p className="text-gray-600">
                Earn points for every item you swap. Use these points to acquire new items from the community, or save
                them up for higher-value pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Swappers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`${testimonial.bg} border-0`}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <blockquote className="text-gray-800 mb-4 italic">"{testimonial.quote}"</blockquote>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">{testimonial.name}</div>
                      {testimonial.age && <div>{testimonial.age}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </div>
          <div className="text-center text-gray-500">©2024 ReWear. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
