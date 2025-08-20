"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = { id: number | string; name: string; subcategories?: string[]; products?: string[]; createdAt?: string }

export default function AdminCategoriesManagePage() {
  const router = useRouter()
  const sp = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [workingId, setWorkingId] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [editName, setEditName] = useState("")
  const [editSubs, setEditSubs] = useState<string[]>([])
  const [editProds, setEditProds] = useState<string[]>([])
  const [inputSub, setInputSub] = useState("")
  const [inputProd, setInputProd] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)

  async function fetchList(token: string | null) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      router.replace("/admin/login")
      return
    }
    fetchList(token)
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [query, categories])

  useEffect(() => {
    const editId = sp?.get("edit")
    if (editId) {
      // Précharger l'élément pour édition
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      if (!token) return router.replace("/admin/login")
      setEditId(editId)
      setSavingEdit(false)
      fetch(`http://127.0.0.1:8000/api/admin/categories/${editId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}))
          if (res.status === 401 || res.status === 403 || data?.code === 401 || data?.code === 403) {
            router.replace("/admin/login")
            return
          }
          if (!res.ok || data?.success === false || !data?.item) throw new Error("Échec du chargement de la catégorie")
          const it = data.item as any
          setEditName(it?.name || "")
          setEditSubs(Array.isArray(it?.subCategories) ? it.subCategories.map((s: any) => s.name) : [])
          setEditProds(Array.isArray(it?.products) ? it.products.map((p: any) => p.name) : [])
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Erreur inconnue"))
    }
  }, [sp, router])

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
      // Rafraîchir la liste
      const token2 = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      await fetchList(token2)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setWorkingId(null)
    }
  }

  function addEditSub() {
    const v = inputSub.trim()
    if (!v) return
    if (!editSubs.includes(v)) setEditSubs((p) => [...p, v])
    setInputSub("")
  }
  function removeEditSub(v: string) {
    setEditSubs((p) => p.filter((x) => x !== v))
  }
  function addEditProd() {
    const v = inputProd.trim()
    if (!v) return
    if (!editProds.includes(v)) setEditProds((p) => [...p, v])
    setInputProd("")
  }
  function removeEditProd(v: string) {
    setEditProds((p) => p.filter((x) => x !== v))
  }

  async function onSaveEdit() {
    if (!editId) return
    setSavingEdit(true)
    setError(null)
    setSuccess(null)
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/categories/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Mise à jour du nom uniquement pour respecter le backend (les relations nécessitent des IDs)
        body: JSON.stringify({ name: editName.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403 || data?.code === 401 || data?.code === 403) {
        router.replace("/admin/login")
        return
      }
      if (!res.ok || data?.success === false) {
        const msg = Array.isArray(data?.errors) && data.errors.length > 0 ? data.errors.join(", ") : "Échec de la mise à jour"
        throw new Error(msg)
      }
      setSuccess("Catégorie mise à jour")
      // rafraîchir la liste puis fermer le panneau d'édition
      await fetchList(token)
      setEditId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setSavingEdit(false)
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
    <div className="min-h-[100svh] bg-[#06080d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Gérer les catégories</h1>
          <p className="text-sm text-white/60">Rechercher, modifier et supprimer</p>
        </div>

        {(error || success) && (
          <div className="mb-4 flex gap-3">
            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>
            )}
          </div>
        )}

        {editId && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium">Modifier la catégorie #{String(editId)}</h2>
              <Button className="bg-white/10 text-white hover:bg-white/20" onClick={() => setEditId(null)}>Fermer</Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/80">Nom</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
              </div>
              <div></div>
              <div>
                <label className="mb-2 block text-sm text-white/80">Sous-catégories</label>
                <div className="flex gap-2">
                  <Input value={inputSub} onChange={(e) => setInputSub(e.target.value)} placeholder="Ajouter une sous-catégorie" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                  <Button type="button" onClick={addEditSub} className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">+</Button>
                </div>
                {editSubs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editSubs.map((s) => (
                      <span key={s} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        {s}
                        <button type="button" onClick={() => removeEditSub(s)} className="text-white/60 hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/80">Produits</label>
                <div className="flex gap-2">
                  <Input value={inputProd} onChange={(e) => setInputProd(e.target.value)} placeholder="Ajouter un produit" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                  <Button type="button" onClick={addEditProd} className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">+</Button>
                </div>
                {editProds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editProds.map((p) => (
                      <span key={p} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        {p}
                        <button type="button" onClick={() => removeEditProd(p)} className="text-white/60 hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button onClick={onSaveEdit} disabled={savingEdit} className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">{savingEdit ? "Enregistrement…" : "Enregistrer"}</Button>
              <Button onClick={() => setEditId(null)} className="bg-white/10 text-white hover:bg-white/20">Annuler</Button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Input
              placeholder="Recherche par nom"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-80 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Button className="bg-white/10 text-white hover:bg-white/20" onClick={() => setQuery("")}>Effacer</Button>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90" onClick={() => router.push('/admin/categories/add')}>Nouvelle catégorie</Button>
            <Button className="bg-white/10 text-white hover:bg-white/20" onClick={() => router.push('/admin/categories')}>Voir la liste</Button>
          </div>
        </div>

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
                  <Button
                    size="sm"
                    className="h-7 bg-rose-500/80 text-white hover:bg-rose-500"
                    onClick={() => onDelete(c.id)}
                    disabled={workingId === c.id}
                  >
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
