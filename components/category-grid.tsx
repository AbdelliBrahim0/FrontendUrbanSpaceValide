"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Hoodies",
    image: "/placeholder.svg?height=400&width=300",
    count: 24,
    featured: true,
  },
  {
    id: 2,
    name: "T-Shirts",
    image: "/placeholder.svg?height=400&width=300",
    count: 18,
    featured: false,
  },
  {
    id: 3,
    name: "Flip Flops",
    image: "/placeholder.svg?height=400&width=300",
    count: 12,
    featured: true,
  },
  {
    id: 4,
    name: "Pants",
    image: "/placeholder.svg?height=400&width=300",
    count: 16,
    featured: false,
  },
  {
    id: 5,
    name: "Shoes",
    image: "/placeholder.svg?height=400&width=300",
    count: 20,
    featured: true,
  },
  {
    id: 6,
    name: "Accessories",
    image: "/placeholder.svg?height=400&width=300",
    count: 8,
    featured: false,
  },
]

export function CategoryGrid() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our curated collections designed for the modern urban lifestyle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={category.featured ? "lg:col-span-2" : ""}
            >
              <Link href={`/category/${category.name.toLowerCase()}`}>
                <motion.div
                  className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-900"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`aspect-[4/3] ${category.featured ? "lg:aspect-[2/1]" : ""} relative overflow-hidden`}
                  >
                    <video
                      src={`/cathegories/${category.name}.mp4`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* Content */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <motion.h3
                        className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-400 via-purple-400 to-green-400 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-lg"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {category.name}
                      </motion.h3>
                      <motion.p
                        className="text-gray-300 mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        {category.count} items
                      </motion.p>
                      <motion.div
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-purple-300 backdrop-blur-sm"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Shop Now
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
