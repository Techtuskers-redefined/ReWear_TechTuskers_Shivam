import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@ReWear.com",
    availability: "24/7",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our team",
    contact: "Available in app",
    availability: "Mon-Fri, 9AM-6PM PST",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our team",
    contact: "+1 (555) 123-SWAP",
    availability: "Mon-Fri, 9AM-5PM PST",
  },
]

const faqs = [
  {
    question: "How does ReWear work?",
    answer:
      "ReWear allows you to list items you want to swap, browse items from other users, and request swaps. Once both parties agree, you can arrange the exchange.",
  },
  {
    question: "Is ReWear free to use?",
    answer:
      "Yes! Creating an account and listing items is completely free. We make money through optional premium features and partnerships.",
  },
  {
    question: "How do I ensure safe swaps?",
    answer:
      "We recommend meeting in public places, checking items carefully, and using our rating system to build trust within the community.",
  },
  {
    question: "What if I'm not satisfied with a swap?",
    answer:
      "We have a 24-hour return policy for swaps. If you're not satisfied, you can arrange to return the items with the other party.",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need help? We're here to assist you with anything related to ReWear.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="font-medium text-gray-900 mb-1">{method.contact}</p>
                <p className="text-sm text-gray-500">{method.availability}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="swap">Swap Problems</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us how we can help you..." className="min-h-[120px]" />
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600">Send Message</Button>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Our Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">ReWear Headquarters</p>
                    <p className="text-gray-600">123 Sustainable Street</p>
                    <p className="text-gray-600">San Francisco, CA 94102</p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Mon-Fri: 9AM-6PM PST</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}