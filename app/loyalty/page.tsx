"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoyaltyProgram } from "@/components/loyalty/loyalty-program"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbNavigation items={[{ label: "Loyalty Program", href: "/loyalty", isActive: true }]} />

          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Loyalty Program
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Earn points with every purchase and unlock exclusive benefits as you level up
              </p>
            </div>

            <LoyaltyProgram currentPoints={1250} totalSpent={2847} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
