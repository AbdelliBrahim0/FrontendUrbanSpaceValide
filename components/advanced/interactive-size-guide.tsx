"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Ruler, User, Zap } from "lucide-react"

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  category: string
}

const sizeData = {
  hoodies: {
    title: "Hoodies & Sweatshirts",
    measurements: ["Chest", "Length", "Sleeve", "Shoulder"],
    sizes: {
      XS: ["32-34", "25", "23", "16"],
      S: ["36-38", "26", "24", "17"],
      M: ["40-42", "27", "25", "18"],
      L: ["44-46", "28", "26", "19"],
      XL: ["48-50", "29", "27", "20"],
      XXL: ["52-54", "30", "28", "21"],
    },
    tips: [
      "Measure around the fullest part of your chest",
      "Length is measured from shoulder to hem",
      "Sleeve length from shoulder seam to cuff",
      "For oversized fit, size up one size",
    ],
  },
  pants: {
    title: "Pants & Jeans",
    measurements: ["Waist", "Hip", "Inseam", "Rise"],
    sizes: {
      XS: ["26-28", "34-36", "30", "9"],
      S: ["28-30", "36-38", "30", "9.5"],
      M: ["30-32", "38-40", "32", "10"],
      L: ["32-34", "40-42", "32", "10.5"],
      XL: ["34-36", "42-44", "34", "11"],
      XXL: ["36-38", "44-46", "34", "11.5"],
    },
    tips: [
      "Measure around your natural waistline",
      "Hip measurement at fullest part",
      "Inseam from crotch to ankle",
      "Rise from crotch to waistband",
    ],
  },
  shoes: {
    title: "Footwear",
    measurements: ["US", "EU", "UK", "CM"],
    sizes: {
      "6": ["6", "39", "5.5", "24"],
      "7": ["7", "40", "6.5", "25"],
      "8": ["8", "41", "7.5", "26"],
      "9": ["9", "42", "8.5", "27"],
      "10": ["10", "43", "9.5", "28"],
      "11": ["11", "44", "10.5", "29"],
      "12": ["12", "45", "11.5", "30"],
    },
    tips: [
      "Measure your foot length in centimeters",
      "Measure at the end of the day when feet are largest",
      "Leave 0.5-1cm space between longest toe and shoe end",
      "Consider width if you have wide or narrow feet",
    ],
  },
}

export function InteractiveSizeGuide({ isOpen, onClose, category }: SizeGuideProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [userMeasurements, setUserMeasurements] = useState<Record<string, string>>({})
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"chart" | "calculator" | "tips">("chart")

  const data = sizeData[category as keyof typeof sizeData] || sizeData.hoodies

  const calculateRecommendedSize = () => {
    // Simple size recommendation logic
    const measurements = Object.values(userMeasurements).map(Number)
    if (measurements.some(isNaN)) return

    // This is a simplified calculation - in reality, you'd have more complex logic
    const avgMeasurement = measurements.reduce((a, b) => a + b, 0) / measurements.length

    if (avgMeasurement < 30) setRecommendedSize("XS")
    else if (avgMeasurement < 35) setRecommendedSize("S")
    else if (avgMeasurement < 40) setRecommendedSize("M")
    else if (avgMeasurement < 45) setRecommendedSize("L")
    else if (avgMeasurement < 50) setRecommendedSize("XL")
    else setRecommendedSize("XXL")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Size Guide Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 bg-gray-900/95 backdrop-blur-md rounded-2xl z-50 shadow-2xl border border-gray-800 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Ruler className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Size Guide</h2>
                    <p className="text-purple-400">{data.title}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-400" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                {[
                  { id: "chart", label: "Size Chart", icon: Ruler },
                  { id: "calculator", label: "Size Calculator", icon: Zap },
                  { id: "tips", label: "Measuring Tips", icon: User },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {/* Size Chart Tab */}
                  {activeTab === "chart" && (
                    <motion.div
                      key="chart"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 text-white font-semibold">Size</th>
                              {data.measurements.map((measurement) => (
                                <th key={measurement} className="text-center py-3 px-4 text-white font-semibold">
                                  {measurement}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(data.sizes).map(([size, measurements]) => (
                              <motion.tr
                                key={size}
                                className={`border-b border-gray-800 cursor-pointer transition-colors duration-300 ${
                                  selectedSize === size
                                    ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20"
                                    : "hover:bg-gray-800/50"
                                }`}
                                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                whileHover={{ scale: 1.01 }}
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-white font-bold text-lg">{size}</span>
                                    {selectedSize === size && (
                                      <motion.div
                                        className="w-2 h-2 bg-purple-500 rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      />
                                    )}
                                  </div>
                                </td>
                                {measurements.map((measurement, index) => (
                                  <td key={index} className="text-center py-4 px-4 text-gray-300">
                                    {measurement}"
                                  </td>
                                ))}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {selectedSize && (
                        <motion.div
                          className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-6 border border-purple-500/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-xl font-bold text-white mb-4">Size {selectedSize} Details</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.measurements.map((measurement, index) => (
                              <div key={measurement} className="text-center">
                                <div className="text-2xl font-bold text-purple-400">
                                  {data.sizes[selectedSize as keyof typeof data.sizes][index]}"
                                </div>
                                <div className="text-gray-400 text-sm">{measurement}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Size Calculator Tab */}
                  {activeTab === "calculator" && (
                    <motion.div
                      key="calculator"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Find Your Perfect Size</h3>
                        <p className="text-gray-400">
                          Enter your measurements to get a personalized size recommendation
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.measurements.map((measurement) => (
                          <motion.div key={measurement} className="space-y-2" whileHover={{ scale: 1.02 }}>
                            <label className="block text-white font-semibold">{measurement} (inches)</label>
                            <input
                              type="number"
                              placeholder={`Enter your ${measurement.toLowerCase()}`}
                              value={userMeasurements[measurement] || ""}
                              onChange={(e) =>
                                setUserMeasurements({
                                  ...userMeasurements,
                                  [measurement]: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                            />
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        onClick={calculateRecommendedSize}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white text-lg relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Calculate My Size</span>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>

                      {recommendedSize && (
                        <motion.div
                          className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <motion.div
                            className="text-6xl font-black text-green-400 mb-2"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            {recommendedSize}
                          </motion.div>
                          <h4 className="text-xl font-bold text-white mb-2">Recommended Size</h4>
                          <p className="text-gray-300">
                            Based on your measurements, we recommend size {recommendedSize}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Measuring Tips Tab */}
                  {activeTab === "tips" && (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">How to Measure</h3>
                        <p className="text-gray-400">Follow these tips for the most accurate measurements</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <p className="text-gray-300 leading-relaxed">{tip}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border border-blue-500/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <User className="w-6 h-6 text-blue-400" />
                          <h4 className="text-lg font-bold text-white">Pro Tip</h4>
                        </div>
                        <p className="text-gray-300">
                          For the best fit, have someone help you measure. Use a flexible measuring tape and don't pull
                          too tight - you should be able to fit one finger under the tape comfortably.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
