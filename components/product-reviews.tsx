"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown, User, Filter } from "lucide-react"

interface Review {
  id: number
  user: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  verified: boolean
  size?: string
  color?: string
}

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

const sampleReviews: Review[] = [
  {
    id: 1,
    user: "Alex M.",
    rating: 5,
    date: "2024-01-15",
    title: "Amazing quality and style!",
    content:
      "This hoodie exceeded my expectations. The LED technology is subtle but really cool, and the material feels premium. Perfect fit and very comfortable.",
    helpful: 12,
    verified: true,
    size: "M",
    color: "Black",
  },
  {
    id: 2,
    user: "Sarah K.",
    rating: 4,
    date: "2024-01-10",
    title: "Great hoodie, runs a bit large",
    content:
      "Love the design and the glow effect is really unique. Only issue is it runs slightly larger than expected, so maybe size down. Overall very happy with the purchase.",
    helpful: 8,
    verified: true,
    size: "L",
    color: "Purple",
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2024-01-08",
    title: "Perfect for night events",
    content:
      "Wore this to a concert and got so many compliments! The LED effect is perfect for dark environments. Quality is top-notch and shipping was fast.",
    helpful: 15,
    verified: true,
    size: "L",
    color: "Cyan",
  },
]

export function ProductReviews({
  productId,
  reviews = sampleReviews,
  averageRating = 4.8,
  totalReviews = 124,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState(0)
  const [showWriteReview, setShowWriteReview] = useState(false)

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 72 },
    { stars: 4, count: 25, percentage: 20 },
    { stars: 3, count: 7, percentage: 6 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
  ]

  const filteredReviews = reviews.filter((review) => filterRating === 0 || review.rating === filterRating)

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <span className="text-5xl font-bold text-white">{averageRating}</span>
            <div>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400">Based on {totalReviews} reviews</p>
            </div>
          </div>

          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWriteReview(true)}
          >
            <span className="relative z-10">Write a Review</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {ratingDistribution.map((item) => (
            <motion.button
              key={item.stars}
              className="flex items-center space-x-3 w-full text-left hover:bg-gray-800/50 p-2 rounded-lg transition-colors duration-300"
              whileHover={{ x: 5 }}
              onClick={() => setFilterRating(filterRating === item.stars ? 0 : item.stars)}
            >
              <div className="flex items-center space-x-1 min-w-[60px]">
                <span className="text-sm text-gray-300">{item.stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
              <span className="text-sm text-gray-400 min-w-[40px]">{item.count}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {filterRating > 0 && (
          <motion.button
            className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setFilterRating(0)}
          >
            <span>{filterRating} Star Reviews</span>
            <span className="text-purple-400">×</span>
          </motion.button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{review.user}</span>
                      {review.verified && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                  </div>
                </div>

                {(review.size || review.color) && (
                  <div className="text-sm text-gray-400">
                    {review.size && <span>Size: {review.size}</span>}
                    {review.size && review.color && <span> • </span>}
                    {review.color && <span>Color: {review.color}</span>}
                  </div>
                )}
              </div>

              <h4 className="font-semibold text-white mb-2">{review.title}</h4>
              <p className="text-gray-300 leading-relaxed mb-4">{review.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </motion.button>

                  <motion.button
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">Not Helpful</span>
                  </motion.button>
                </div>

                <motion.button
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Report
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
          <p className="text-gray-400">
            {filterRating > 0
              ? `No ${filterRating}-star reviews yet. Try adjusting your filter.`
              : "Be the first to review this product!"}
          </p>
        </div>
      )}
    </div>
  )
}
