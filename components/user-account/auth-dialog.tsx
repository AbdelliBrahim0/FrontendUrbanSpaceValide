"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { DialogTitle } from "@/components/ui/dialog"

// Ce composant n'est plus utilisé. L'authentification se fait désormais sur la page /auth
export function AuthDialog() {
  return null;
}