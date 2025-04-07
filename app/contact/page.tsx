import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message here..." rows={5} />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-muted-foreground mt-1">
                    Westlands Business Park
                    <br />
                    Waiyaki Way, 3rd Floor
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-muted-foreground mt-1">
                    support@shopie-one.co.ke
                    <br />
                    sales@shopie-one.co.ke
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-muted-foreground mt-1">
                    +254 722 123 456
                    <br />
                    Monday - Friday, 8am - 5pm EAT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden">
        {/* This would be a Google Map in a real implementation */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Interactive Map Would Be Here</p>
        </div>
      </div>
    </div>
  )
}

