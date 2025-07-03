"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, Search, Heart, ShoppingBag, User, Menu } from "lucide-react"

const navItems = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "search", icon: Search, label: "Search", href: "/search" },
  { id: "wishlist", icon: Heart, label: "Wishlist", href: "/wishlist" },
  { id: "cart", icon: ShoppingBag, label: "Cart", href: "/cart", badge: 3 },
  { id: "profile", icon: User, label: "Profile", href: "/profile" },
]

export function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                activeTab === item.id ? "text-purple-400" : "text-gray-400"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>

              {/* Active Indicator */}
              {activeTab === item.id && (
                <motion.div
                  className="absolute -top-1 left-1/2 w-1 h-1 bg-purple-400 rounded-full"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full shadow-lg flex items-center justify-center z-50 md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(168, 85, 247, 0.3)",
            "0 0 30px rgba(168, 85, 247, 0.6)",
            "0 0 20px rgba(168, 85, 247, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <Menu className="w-6 h-6 text-white" />
      </motion.button>
    </>
  )
}
