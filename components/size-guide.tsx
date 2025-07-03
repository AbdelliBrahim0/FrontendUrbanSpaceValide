"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Ruler } from "lucide-react"

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  category: string
}

const sizeCharts = {
  hoodies: {
    title: "Hoodies & Sweatshirts",
    measurements: ["Chest", "Length", "Sleeve"],
    sizes: {
      XS: ["32-34", "25", "23"],
      S: ["36-38", "26", "24"],
      M: ["40-42", "27", "25"],
      L: ["44-46", "28", "26"],
      XL: ["48-50", "29", "27"],
      XXL: ["52-54", "30", "28"],
    },
  },
  tshirts: {
    title: "T-Shirts",
    measurements: ["Chest", "Length", "Sleeve"],
    sizes: {
      XS: ["32-34", "24", "7"],
      S: ["36-38", "25", "8"],
      M: ["40-42", "26", "8.5"],
      L: ["44-46", "27", "9"],
      XL: ["48-50", "28", "9.5"],
      XXL: ["52-54", "29", "10"],
    },
  },
  pants: {
    title: "Pants & Jeans",
    measurements: ["Waist", "Hip", "Inseam"],
    sizes: {
      XS: ["26-28", "34-36", "30"],
      S: ["28-30", "36-38", "30"],
      M: ["30-32", "38-40", "32"],
      L: ["32-34", "40-42", "32"],
      XL: ["34-36", "42-44", "34"],
      XXL: ["36-38", "44-46", "34"],
    },
  },
  shoes: {
    title: "Shoes",
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
  },
}

export function SizeGuide({ isOpen, onClose, category }: SizeGuideProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const chart = sizeCharts[category as keyof typeof sizeCharts] || sizeCharts.hoodies

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Size Guide Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <Ruler className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Size Guide - {chart.title}</h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Measurement Instructions */}
                <div className="mb-8 p-4 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">How to Measure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <strong className="text-purple-400">Chest:</strong> Measure around the fullest part of your chest
                    </div>
                    <div>
                      <strong className="text-cyan-400">Length:</strong> Measure from shoulder to hem
                    </div>
                    <div>
                      <strong className="text-purple-400">Sleeve:</strong> Measure from shoulder seam to cuff
                    </div>
                    <div>
                      <strong className="text-cyan-400">Waist:</strong> Measure around your natural waistline
                    </div>
                  </div>
                </div>

                {/* Size Chart Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-white font-semibold">Size</th>
                        {chart.measurements.map((measurement) => (
                          <th key={measurement} className="text-left py-3 px-4 text-white font-semibold">
                            {measurement} (inches)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(chart.sizes).map(([size, measurements]) => (
                        <motion.tr
                          key={size}
                          className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 cursor-pointer ${
                            selectedSize === size ? "bg-purple-600/20" : ""
                          }`}
                          whileHover={{ x: 5 }}
                          onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-purple-400">{size}</span>
                          </td>
                          {measurements.map((measurement, index) => (
                            <td key={index} className="py-3 px-4 text-gray-300">
                              {measurement}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Size Recommendation */}
                {selectedSize && (
                  <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">Size {selectedSize} Selected</h4>
                    <p className="text-gray-300">
                      This size is recommended for the measurements shown above. For the best fit, compare these
                      measurements with a similar garment you already own.
                    </p>
                  </motion.div>
                )}

                {/* Additional Tips */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Fit Tips</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• All measurements are in inches</li>
                      <li>• Measurements may vary by ±0.5 inches</li>
                      <li>• For loose fit, size up</li>
                      <li>• For fitted look, choose your exact size</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Still Unsure?</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Contact our customer service team for personalized sizing advice.
                    </p>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Support
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
