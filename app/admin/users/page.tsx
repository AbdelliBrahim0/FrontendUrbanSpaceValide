"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type User = { id: number | string; username: string; roles: string[] }

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      router.replace("/admin/login")
      return
    }

    // Try to fetch from Symfony. If CORS/back-end not ready, fallback to static.
    fetch("http://localhost:8000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch-failed")
        const data = await res.json()
        // Expecting { users: User[] }
        if (Array.isArray(data?.users)) {
          setUsers(data.users as User[])
        } else {
          throw new Error("bad-shape")
        }
      })
      .catch(() => {
        // Static fallback demo data
        setUsers([
          { id: 1, username: "admin", roles: ["ROLE_ADMIN"] },
          { id: 2, username: "sara", roles: ["ROLE_USER"] },
          { id: 3, username: "mehdi", roles: ["ROLE_USER"] },
          { id: 4, username: "nour", roles: ["ROLE_USER"] },
          { id: 5, username: "yanis", roles: ["ROLE_USER"] },
          { id: 6, username: "karim", roles: ["ROLE_USER"] },
          { id: 7, username: "ines", roles: ["ROLE_USER"] },
          { id: 8, username: "walid", roles: ["ROLE_USER"] },
          { id: 9, username: "samir", roles: ["ROLE_USER"] },
          { id: 10, username: "amina", roles: ["ROLE_USER"] },
        ])
      })
      .finally(() => setLoading(false))
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.username.toLowerCase().includes(q))
  }, [query, users])

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-[#06080d] text-white grid place-items-center">
        <div className="animate-pulse text-white/70">Chargement des utilisateurs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] bg-[#06080d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tous les utilisateurs</h1>
            <p className="text-sm text-white/60">Gestion des comptes et actions rapides</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Recherche par username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 w-64"
            />
            <Button className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">Rechercher</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-2 border-b border-white/10 px-4 py-3 text-xs text-white/60">
            <span>ID</span>
            <span>Utilisateur</span>
            <span>Rôles</span>
            <span>Date de création</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-white/60">Aucun utilisateur</div>
          ) : (
            filtered.map((u) => (
              <div key={u.id} className="grid grid-cols-5 items-center gap-2 px-4 py-3 text-sm text-white/80">
                <span className="truncate">{u.id}</span>
                <span className="truncate">{u.username}</span>
                <span className="truncate">{u.roles.join(", ")}</span>
                <span className="truncate text-white/50">—</span>
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="h-7 bg-white/10 text-white hover:bg-white/20">Voir</Button>
                  <Button size="sm" className="h-7 bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">Bloquer</Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-white/60">
          <span>Total: {filtered.length}</span>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">Précédent</Button>
            <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
