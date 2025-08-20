"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, Trash2, Edit, Loader2 } from "lucide-react"
import BackToDashboardButton from "@/components/admin/BackToDashboardButton"

type Category = { id: number | string; name: string; subcategories?: string[]; products?: string[]; createdAt?: string }

export default function AdminCategoriesListPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [workingId, setWorkingId] = useState<string | number | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      router.replace("/admin/login")
      return
    }

    fetch("http://127.0.0.1:8000/api/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (res.status === 401 || res.status === 403 || data?.code === 401 || data?.code === 403) {
          router.replace("/admin/login")
          return
        }
        if (!res.ok || data?.success === false) throw new Error("Échec du chargement des catégories")
        if (Array.isArray(data?.items)) {
          const mapped: Category[] = (data.items as any[]).map((it: any) => ({
            id: it.id,
            name: it.name,
            subcategories: Array.isArray(it.subCategories) ? it.subCategories.map((s: any) => s.name) : [],
            products: Array.isArray(it.products) ? it.products.map((p: any) => p.name) : [],
            createdAt: it.createdAt,
          }))
          setCategories(mapped)
        } else {
          throw new Error("Réponse invalide")
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      })
      .finally(() => setLoading(false))
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [query, categories])

  async function onDelete(id: string | number) {
    setError(null)
    setSuccess(null)
    setWorkingId(id)
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    try {
      if (!window.confirm("Supprimer cette catégorie ?")) {
        setWorkingId(null)
        return
      }
      const res = await fetch(`http://127.0.0.1:8000/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403 || data?.code === 401 || data?.code === 403) {
        router.replace("/admin/login")
        return
      }
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Échec de la suppression")
      setSuccess(data?.message || "Catégorie supprimée avec succès.")
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setWorkingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-[#06080d] text-white grid place-items-center">
        <div className="animate-pulse text-white/70">Chargement des catégories…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06080d] p-8">
      <div className="max-w-6xl mx-auto">
        <BackToDashboardButton />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Gestion des catégories
          </h1>
          <div className="flex gap-2">
            <Input
              placeholder="Recherche par nom"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 w-64"
            />
            <Button className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90" onClick={() => router.push('/admin/categories/add')}>Ajouter</Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>
        )}

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="grid grid-cols-6 gap-2 border-b border-white/10 px-4 py-3 text-xs text-white/60">
            <span>ID</span>
            <span>Catégorie</span>
            <span>Sous-catégories</span>
            <span>Produits</span>
            <span>Créée le</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-white/60">Aucune catégorie</div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="grid grid-cols-6 items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5">
                <span className="truncate">{c.id}</span>
                <span className="truncate">{c.name}</span>
                <span className="truncate text-white/70">{c.subcategories?.join(', ') || '—'}</span>
                <span className="truncate text-white/70">{c.products?.length ?? '—'}</span>
                <span className="truncate text-white/70">{c.createdAt ?? '—'}</span>
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="h-7 bg-white/10 text-white hover:bg-white/20" onClick={() => router.push(`/admin/categories/manage?edit=${c.id}`)}>Modifier</Button>
                  <Button size="sm" className="h-7 bg-rose-500/80 text-white hover:bg-rose-500" onClick={() => onDelete(c.id)} disabled={workingId === c.id}>
                    {workingId === c.id ? 'Suppression…' : 'Supprimer'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
