"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Admin = { id: number | string; username: string; roles: string[] }

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [usersModalOpen, setUsersModalOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [actionsModalOpen, setActionsModalOpen] = useState(false)
  const [actionsCardName, setActionsCardName] = useState<string>("")

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      router.replace("/admin/login")
      return
    }

    fetch("http://localhost:8000/api/admin/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error((data?.errors && data.errors[0]) || "Non autorisé")
        setAdmin(data.admin as Admin)
      })
      .catch(() => {
        try { localStorage.removeItem("admin_token") } catch {}
        router.replace("/admin/login")
      })
      .finally(() => setLoading(false))
  }, [router])

  // --- Static demo data ---
  const kpis = {
    users: 12840,
    products: 3520,
    categories: 24,
    subcategories: 96,
  }

  const salesTrend = [
    { m: "Jan", v: 320 },
    { m: "Fév", v: 410 },
    { m: "Mar", v: 380 },
    { m: "Avr", v: 520 },
    { m: "Mai", v: 610 },
    { m: "Juin", v: 540 },
  ]

  const inventoryBars = [
    { name: "Users", value: 12840 },
    { name: "Produits", value: 3520 },
    { name: "Catégories", value: 24 },
    { name: "Sous-cat.", value: 96 },
  ]

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-[#06080d] text-white grid place-items-center">
        <div className="animate-pulse text-white/70">Chargement du tableau de bord...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] bg-[#06080d] text-white relative overflow-hidden">
      {/* Accent Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-[#0db9b5]/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/10">
              <Image src="/logo.png" alt="UrbanSpace" width={40} height={40} className="h-10 w-10 object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
              <p className="text-sm text-white/60">Bienvenue {admin ? `, ${admin.username}` : ""}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
              onClick={() => router.push("/")}
            >
              Accueil site
            </Button>
            <Button
              className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90"
              onClick={() => {
                try { localStorage.removeItem("admin_token") } catch {}
                router.replace("/admin/login")
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{label:'Utilisateurs', value:kpis.users}, {label:'Produits', value:kpis.products}, {label:'Catégories', value:kpis.categories}, {label:'Sous-catégories', value:kpis.subcategories}].map((k, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl shadow-black/30">
              <p className="text-sm text-white/60">{k.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{k.value.toLocaleString()}</p>
              <div className="mt-3 h-1.5 w-24 rounded-full bg-[#0db9b5]/60" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/80">Tendance des ventes</h3>
              <span className="text-xs text-white/50">6 derniers mois</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0db9b5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0db9b5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="m" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Area type="monotone" dataKey="v" stroke="#0db9b5" fillOpacity={1} fill="url(#colorPrimary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/80">Répartition</h3>
              <span className="text-xs text-white/50">Entités</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#0b0f16", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Bar dataKey="value" fill="#0db9b5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Entity Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["Utilisateurs", "Produits", "Catégories", "Sous-catégories"].map((title, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-white/80">{title}</h4>
                <span className="text-xs text-white/50">Statique</span>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center justify-between">
                  <span>Dernière maj</span>
                  <span className="text-white/50">il y a 2j</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Éléments actifs</span>
                  <span className="text-white/50">—</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Actions rapides</span>
                  {title === "Utilisateurs" ? (
                    <Button
                      size="sm"
                      className="h-7 bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90"
                      onClick={() => setUsersModalOpen(true)}
                    >
                      Voir
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90"
                      onClick={() => {
                        setActionsCardName(title)
                        setActionsModalOpen(true)
                      }}
                    >
                      Voir
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Users Modal */}
        <Dialog open={usersModalOpen} onOpenChange={setUsersModalOpen}>
          <DialogContent className="sm:max-w-2xl overflow-hidden border border-white/10 bg-[#0b1017]/90 text-white shadow-2xl backdrop-blur-2xl [box-shadow:0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-10px_rgba(13,185,181,0.35)]">
            <div className="border-b border-white/10 bg-gradient-to-r from-[#0db9b5]/20 via-transparent to-fuchsia-500/10 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <span className="inline-flex h-6 items-center rounded-full bg-[#0db9b5]/15 px-2 text-xs font-medium text-[#0db9b5] ring-1 ring-[#0db9b5]/30">Admin</span>
                  Gestion des utilisateurs
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Lister, rechercher et bloquer des utilisateurs.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher un utilisateur (username, email)"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#0db9b5]/50"
                />
                <Button className="bg-[#0db9b5] text-black shadow-lg shadow-[#0db9b5]/30 transition hover:translate-y-[-1px] hover:bg-[#0db9b5]/90">Rechercher</Button>
              </div>

              <div className="overflow-hidden rounded-lg border border-white/10">
                <div className="grid grid-cols-4 gap-2 border-b border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                  <span>ID</span>
                  <span>Utilisateur</span>
                  <span>Rôles</span>
                  <span className="text-right">Action</span>
                </div>
                {[
                  { id: 1, username: "admin", roles: ["ROLE_ADMIN"] },
                  { id: 2, username: "sara", roles: ["ROLE_USER"] },
                  { id: 3, username: "mehdi", roles: ["ROLE_USER"] },
                  { id: 4, username: "nour", roles: ["ROLE_USER"] },
                  { id: 5, username: "yanis", roles: ["ROLE_USER"] },
                  { id: 6, username: "karim", roles: ["ROLE_USER"] },
                ]
                  .filter(u => !userSearch || u.username.toLowerCase().includes(userSearch.toLowerCase()))
                  .slice(0, 5)
                  .map((u) => (
                  <div key={u.id} className="grid grid-cols-4 items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                    <span className="truncate">{u.id}</span>
                    <span className="truncate">{u.username}</span>
                    <span className="truncate">{u.roles.join(", ")}</span>
                    <div className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-1 h-4 w-4"><path d="M12 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Zm0-18a8 8 0 0 0-6.32 12.8L16.8 5.68A7.966 7.966 0 0 0 12 4Zm6.32 3.2L7.2 18.32A8 8 0 0 0 18.32 7.2Z"/></svg>
                        Bloquer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <Button className="bg-white/10 text-white backdrop-blur hover:bg-white/20" onClick={() => setUsersModalOpen(false)}>
                Fermer
              </Button>
              <Button className="bg-[#0db9b5] text-black shadow-lg shadow-[#0db9b5]/30 transition hover:translate-y-[-1px] hover:bg-[#0db9b5]/90" onClick={() => router.push('/admin/users')}>
                Voir tous les utilisateurs
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Generic Actions Modal for other cards */}
        <Dialog open={actionsModalOpen} onOpenChange={setActionsModalOpen}>
          <DialogContent className="sm:max-w-md overflow-hidden border border-white/10 bg-[#0b1017]/90 text-white shadow-2xl backdrop-blur-2xl [box-shadow:0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-10px_rgba(13,185,181,0.35)]">
            <div className="border-b border-white/10 bg-gradient-to-r from-[#0db9b5]/20 via-transparent to-fuchsia-500/10 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <span className="inline-flex h-6 items-center rounded-full bg-[#0db9b5]/15 px-2 text-xs font-medium text-[#0db9b5] ring-1 ring-[#0db9b5]/30">Actions</span>
                  {actionsCardName}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Actions disponibles pour {actionsCardName.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="grid grid-cols-2 gap-3 px-1">
              <Button className="group h-11 justify-start gap-2 bg-[#0db9b5] text-black shadow-lg shadow-[#0db9b5]/30 transition hover:translate-y-[-1px] hover:bg-[#0db9b5]/90">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6Z"/></svg>
                Ajouter
              </Button>
              <Button className="group h-11 justify-start gap-2 bg-white/10 text-white backdrop-blur transition hover:translate-y-[-1px] hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
                Afficher
              </Button>
              <Button className="group h-11 justify-start gap-2 bg-white/10 text-white backdrop-blur transition hover:translate-y-[-1px] hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-2.59-2.59a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 2.08-1.98Z"/></svg>
                Modifier
              </Button>
              <Button className="group h-11 justify-start gap-2 bg-rose-500/80 text-white transition hover:translate-y-[-1px] hover:bg-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6 7h12l-1 13H7L6 7Zm2-4h8l1 3H7l1-3Z"/></svg>
                Supprimer
              </Button>
            </div>

            <DialogFooter className="border-t border-white/10 pt-4">
              <Button className="bg-white/10 text-white backdrop-blur hover:bg-white/20" onClick={() => setActionsModalOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
