"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Package, TrendingDown } from "lucide-react"

interface StockIndicatorProps {
  stock: number
  maxStock?: number
  showExact?: boolean
  size?: "sm" | "md" | "lg"
}

export function StockIndicator({ stock, maxStock = 100, showExact = false, size = "md" }: StockIndicatorProps) {
  const stockPercentage = (stock / maxStock) * 100

  const getStockStatus = () => {
    if (stock === 0) return { status: "out", color: "red", message: "Out of Stock" }
    if (stock <= 5) return { status: "low", color: "orange", message: "Only few left!" }
    if (stock <= 20) return { status: "medium", color: "yellow", message: "Limited stock" }
    return { status: "high", color: "green", message: "In Stock" }
  }

  const { status, color, message } = getStockStatus()

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="space-y-2">
      {/* Stock Status Badge */}
      <motion.div
        className={`inline-flex items-center space-x-2 rounded-full font-medium ${sizeClasses[size]} ${
          status === "out"
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : status === "low"
              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              : status === "medium"
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-green-500/20 text-green-400 border border-green-500/30"
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {status === "out" && <AlertTriangle className={iconSizes[size]} />}
        {status === "low" && <TrendingDown className={iconSizes[size]} />}
        {status === "medium" && <Package className={iconSizes[size]} />}
        {status === "high" && <Package className={iconSizes[size]} />}

        <span>{showExact ? `${stock} left` : message}</span>
      </motion.div>

      {/* Stock Level Bar */}
      {stock > 0 && size !== "sm" && (
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              status === "low"
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : status === "medium"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stockPercentage, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Urgency Animation for Low Stock */}
      {status === "low" && (
        <motion.div
          className="text-xs text-orange-400"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          ⚡ Hurry! Only {stock} items remaining
        </motion.div>
      )}
    </div>
  )
}
