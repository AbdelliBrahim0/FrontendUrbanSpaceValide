"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileDashboard } from "@/components/user-account/profile-dashboard"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <ProfileDashboard />
      <Footer />
    </div>
  )
}
