"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCards } from "@/components/product-cards"
import { Filter, Grid, List } from "lucide-react"
import { SmartFilterSystem } from "@/components/advanced/smart-filter-system"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

const products = [
  {
    id: 1,
    name: "Neon Pulse Hoodie",
    price: 89,
    originalPrice: 120,
    discount: 25,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "Hoodies",
    rating: 4.8,
    reviews: 124,
    description: "Premium neon hoodie with LED technology and ultra-soft fabric",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Purple", "Cyan"],
    inStock: true,
  },
  {
    id: 2,
    name: "Urban Glow Sneakers",
    price: 159,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Shoes",
    rating: 4.6,
    reviews: 89,
    description: "Futuristic sneakers with glow-in-the-dark soles",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Blue"],
    inStock: true,
  },
  {
    id: 3,
    name: "Street Beam Jacket",
    price: 199,
    originalPrice: 249,
    discount: 20,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "Jackets",
    rating: 4.9,
    reviews: 156,
    description: "Weather-resistant jacket with integrated LED strips",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
    inStock: true,
  },
  {
    id: 4,
    name: "Cyber Cargo Pants",
    price: 129,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Pants",
    rating: 4.4,
    reviews: 67,
    description: "Multi-pocket cargo pants with tech-inspired design",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Olive", "Gray"],
    inStock: false,
  },
  {
    id: 5,
    name: "Holographic Tee",
    price: 59,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "T-Shirts",
    rating: 4.7,
    reviews: 203,
    description: "Color-shifting holographic print on premium cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Silver"],
    inStock: true,
  },
  {
    id: 6,
    name: "Future Boots",
    price: 189,
    originalPrice: 220,
    discount: 15,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Shoes",
    rating: 4.5,
    reviews: 78,
    description: "High-tech boots with smart temperature control",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Red"],
    inStock: true,
  },
]

export default function CollectionPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <section className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbNavigation items={[{ label: "Collection", href: "/collection", isActive: true }]} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Collection
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our complete range of premium streetwear pieces
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="w-5 h-5" />
              <span>Smart Filters</span>
            </motion.button>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{products.length} products</span>

              <div className="flex items-center space-x-2">
                <motion.button
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    viewMode === "grid" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    viewMode === "list" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
            layout
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
              >
                <ProductCards product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SmartFilterSystem
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => console.log("Applied filters:", filters)}
      />

      <Footer />
    </div>
  )
}
