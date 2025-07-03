"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutProcess } from "@/components/checkout/checkout-process"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CheckoutProcess />
      <Footer />
    </div>
  )
}
