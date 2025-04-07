import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-orange-500">S</span>
              <span className="text-xl font-semibold">hopie-one Electronics</span>
            </Link>
            <p className="text-slate-600 max-w-md">
              Shopie-One Electronics is Kenya's premier destination for high-quality electronics, gadgets, and accessories. We offer the latest technology at competitive prices with exceptional customer service and nationwide delivery. Established in 2023, we've quickly become a trusted name in Kenya's tech retail market.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-600 hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-slate-600 hover:text-orange-500">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-orange-500">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-600 hover:text-orange-500">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Get in touch</h3>
            <ul className="space-y-3">
              <li className="text-slate-600">0711692245</li>
              <li className="text-slate-600">jimmytole1262@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-slate-600 text-sm">
        Copyright 2025 © Shopie-one Electronics. All Rights Reserved.
      </div>
    </footer>
  )
}

