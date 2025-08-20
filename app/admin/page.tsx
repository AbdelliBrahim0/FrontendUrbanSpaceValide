'use client'

import { redirect } from "next/navigation"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackToDashboardButton from "@/components/admin/BackToDashboardButton"

export default function AdminIndexPage() {
  redirect("/admin/login")
}
