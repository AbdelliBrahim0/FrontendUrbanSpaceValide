"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Package, Heart, Settings, CreditCard, MapPin, Bell, Shield, LogOut } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar: string
  memberSince: string
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
}

const userProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "January 2023",
  totalOrders: 24,
  totalSpent: 2847,
  loyaltyPoints: 1250,
}

const menuItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
]

export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* User Info */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt={userProfile.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{userProfile.name}</h2>
                <p className="text-gray-400 text-sm">{userProfile.email}</p>
                <p className="text-purple-400 text-sm mt-2">Member since {userProfile.memberSince}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-2xl font-bold text-white">{userProfile.totalOrders}</div>
                  <div className="text-sm text-gray-400">Total Orders</div>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-2xl font-bold text-white">${userProfile.totalSpent}</div>
                  <div className="text-sm text-gray-400">Total Spent</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-500/30">
                  <div className="text-2xl font-bold text-white">{userProfile.loyaltyPoints}</div>
                  <div className="text-sm text-gray-400">Loyalty Points</div>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}

                <motion.button
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 mt-8"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </motion.button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-white mb-8 capitalize">{activeTab}</h1>

              {/* Content based on active tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Order History</h3>
                  <p className="text-gray-400">Your recent orders will appear here</p>
                </div>
              )}

              {/* Add more tab content as needed */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
