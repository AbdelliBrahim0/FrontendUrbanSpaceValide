"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileDashboard } from "@/components/user-account/profile-dashboard"
import { SmartFilterSidebar } from "@/components/advanced/smart-filter-system"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        <SmartFilterSidebar />
        <div className="flex-1">
          <ProfileDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}
