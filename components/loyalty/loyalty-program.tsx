"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Crown, Zap, Award, TrendingUp } from "lucide-react"

interface LoyaltyTier {
  id: string
  name: string
  icon: any
  minPoints: number
  benefits: string[]
  color: string
  bgGradient: string
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Urban Explorer",
    icon: Star,
    minPoints: 0,
    benefits: ["5% off on orders", "Early access to sales", "Free shipping on orders $75+"],
    color: "text-orange-400",
    bgGradient: "from-orange-600/20 to-yellow-600/20",
  },
  {
    id: "silver",
    name: "Street Legend",
    icon: Award,
    minPoints: 500,
    benefits: ["10% off on orders", "Priority customer support", "Exclusive member events", "Free returns"],
    color: "text-gray-300",
    bgGradient: "from-gray-600/20 to-slate-600/20",
  },
  {
    id: "gold",
    name: "Neon Elite",
    icon: Crown,
    minPoints: 1000,
    benefits: [
      "15% off on orders",
      "VIP customer support",
      "Early access to new collections",
      "Free express shipping",
      "Birthday rewards",
    ],
    color: "text-yellow-400",
    bgGradient: "from-yellow-600/20 to-orange-600/20",
  },
  {
    id: "platinum",
    name: "Cyber Royalty",
    icon: Zap,
    minPoints: 2000,
    benefits: [
      "20% off on orders",
      "Personal stylist consultation",
      "Exclusive limited editions",
      "Free overnight shipping",
      "VIP events & experiences",
      "Custom product requests",
    ],
    color: "text-purple-400",
    bgGradient: "from-purple-600/20 to-cyan-600/20",
  },
]

interface LoyaltyProgramProps {
  currentPoints: number
  totalSpent: number
}

export function LoyaltyProgram({ currentPoints = 1250, totalSpent = 2847 }: LoyaltyProgramProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const getCurrentTier = () => {
    return (
      loyaltyTiers
        .slice()
        .reverse()
        .find((tier) => currentPoints >= tier.minPoints) || loyaltyTiers[0]
    )
  }

  const getNextTier = () => {
    const currentTier = getCurrentTier()
    const currentIndex = loyaltyTiers.findIndex((tier) => tier.id === currentTier.id)
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const pointsToNext = nextTier ? nextTier.minPoints - currentPoints : 0
  const progressPercentage = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <motion.div
        className={`bg-gradient-to-r ${currentTier.bgGradient} rounded-2xl p-8 border border-gray-800`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-black/20 rounded-full ${currentTier.color}`}>
              <currentTier.icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentTier.name}</h2>
              <p className="text-gray-300">Your current tier</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{currentPoints}</div>
            <div className="text-gray-300">Points</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress to {nextTier.name}</span>
              <span className="text-white font-medium">{pointsToNext} points to go</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Current Benefits */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Your Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentTier.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                <span className="text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* All Tiers */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Loyalty Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loyaltyTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`relative bg-gradient-to-br ${tier.bgGradient} rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
                tier.id === currentTier.id
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : "border-gray-800 hover:border-gray-700"
              } ${selectedTier === tier.id ? "scale-105" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
            >
              {/* Current Tier Badge */}
              {tier.id === currentTier.id && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Current
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`inline-flex p-3 bg-black/20 rounded-full ${tier.color} mb-3`}>
                  <tier.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                <p className="text-gray-400 text-sm">{tier.minPoints}+ points</p>
              </div>

              <div className="space-y-2">
                {tier.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    <span className="text-gray-300 text-xs">{benefit}</span>
                  </div>
                ))}
                {tier.benefits.length > 3 && (
                  <div className="text-purple-400 text-xs">+{tier.benefits.length - 3} more benefits</div>
                )}
              </div>

              {/* Expanded Benefits */}
              {selectedTier === tier.id && tier.benefits.length > 3 && (
                <motion.div
                  className="mt-4 pt-4 border-t border-gray-700 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {tier.benefits.slice(3).map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      <span className="text-gray-300 text-xs">{benefit}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <motion.div
        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Points Activity</h3>
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{currentPoints}</div>
            <div className="text-gray-400 text-sm">Current Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">${totalSpent}</div>
            <div className="text-gray-400 text-sm">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {Math.floor(totalSpent / 10)} {/* Assuming 1 point per $10 spent */}
            </div>
            <div className="text-gray-400 text-sm">Points Earned</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
