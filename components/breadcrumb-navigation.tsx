"use client"

import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300">
          <Home className="w-4 h-4" />
        </Link>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={item.href}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.isActive ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
              {item.label}
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  )
}
