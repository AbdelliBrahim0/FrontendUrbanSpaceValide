"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Package, Heart, Tag, User, Check } from "lucide-react"

interface Notification {
  id: string
  type: "order" | "wishlist" | "promotion" | "account"
  title: string
  message: string
  time: string
  read: boolean
  icon: any
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Shipped",
    message: "Your order #US-2024-001 has been shipped and is on its way!",
    time: "2 hours ago",
    read: false,
    icon: Package,
  },
  {
    id: "2",
    type: "wishlist",
    title: "Item Back in Stock",
    message: "Neon Pulse Hoodie is now available in your size!",
    time: "4 hours ago",
    read: false,
    icon: Heart,
  },
  {
    id: "3",
    type: "promotion",
    title: "Flash Sale Alert",
    message: "50% off on all hoodies - Limited time offer!",
    time: "1 day ago",
    read: true,
    icon: Tag,
  },
  {
    id: "4",
    type: "account",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    time: "2 days ago",
    read: true,
    icon: User,
  },
]

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notificationList, setNotificationList] = useState(notifications)

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notificationList.filter((n) => !n.read).length

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

          {/* Notification Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 z-50 shadow-2xl border-l border-gray-800"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <Bell className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                  )}
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

              {/* Actions */}
              {unreadCount > 0 && (
                <div className="p-4 border-b border-gray-800">
                  <motion.button
                    onClick={markAllAsRead}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mark all as read
                  </motion.button>
                </div>
              )}

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {notificationList.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 ${
                        !notification.read ? "bg-purple-500/5" : ""
                      }`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "order"
                              ? "bg-blue-500/20 text-blue-400"
                              : notification.type === "wishlist"
                                ? "bg-red-500/20 text-red-400"
                                : notification.type === "promotion"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          <notification.icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-medium text-sm">{notification.title}</h3>
                            {!notification.read && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-500 text-xs">{notification.time}</span>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-purple-400 hover:text-purple-300 text-xs"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Check className="w-3 h-3" />
                                </motion.button>
                              )}
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-gray-500 hover:text-red-400 text-xs"
                                whileHover={{ scale: 1.05 }}
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {notificationList.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                    <p className="text-gray-400">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
