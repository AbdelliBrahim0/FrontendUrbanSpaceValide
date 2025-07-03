"use client"

import { Navbar } from "@/components/navbar"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Navbar />
      {children}
      <MobileNavigation />
    </div>
  )
} 