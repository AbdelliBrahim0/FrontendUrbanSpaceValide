"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import BackToDashboardButton from "@/components/admin/BackToDashboardButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subcategoriesApi, productsApi, categoriesApi } from "@/lib/api"

export default function AdminAddCategoryPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [availableSubs, setAvailableSubs] = useState<Array<{ id: number; name: string }>>([])
  const [availableProds, setAvailableProds] = useState<Array<{ id: number; name: string }>>([])
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([])
  const [selectedProdIds, setSelectedProdIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load options
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    if (!token) {
      router.replace("/admin/login")
      return
    }

    const load = async () => {
      try {
        // Charger les sous-catégories et produits pour sélection
        const [subs, prods] = await Promise.all([
          subcategoriesApi.list(),
          productsApi.list(),
        ])
        setAvailableSubs(subs.map(s => ({ id: s.id, name: s.name })))
        setAvailableProds(prods.map(p => ({ id: p.id, name: p.name })))
      } catch (e) {
        setError("Impossible de charger les données nécessaires")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const canSave = useMemo(() => name.trim().length > 1, [name])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      const res = await categoriesApi.create({
        name: name.trim(),
        subCategories: selectedSubIds,
        products: selectedProdIds,
      })
      void res
      setSuccess("Catégorie créée avec succès")
      setTimeout(() => router.push("/admin/categories"), 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setSaving(false)
    }
  }

  const toggleSub = (id: number) => {
    setSelectedSubIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  const toggleProd = (id: number) => {
    setSelectedProdIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-[#06080d] p-8">
      <div className="max-w-3xl mx-auto">
        <BackToDashboardButton />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Ajouter une catégorie</h1>
          <p className="text-sm text-white/60">Nom + sous-catégories et produits</p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">Chargement…</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-white/80">Nom de la catégorie</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Streetwear"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/80">Sous-catégories</label>
                <div className="max-h-64 overflow-auto rounded-lg border border-white/10 p-3 bg-white/5">
                  {availableSubs.length === 0 ? (
                    <div className="text-white/60 text-sm">Aucune sous-catégorie</div>
                  ) : (
                    availableSubs.map(s => (
                      <label key={s.id} className="flex items-center gap-2 py-1 text-sm">
                        <input type="checkbox" checked={selectedSubIds.includes(s.id)} onChange={() => toggleSub(s.id)} />
                        <span>{s.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Produits</label>
                <div className="max-h-64 overflow-auto rounded-lg border border-white/10 p-3 bg-white/5">
                  {availableProds.length === 0 ? (
                    <div className="text-white/60 text-sm">Aucun produit</div>
                  ) : (
                    availableProds.map(p => (
                      <label key={p.id} className="flex items-center gap-2 py-1 text-sm">
                        <input type="checkbox" checked={selectedProdIds.includes(p.id)} onChange={() => toggleProd(p.id)} />
                        <span>{p.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!canSave || saving} className="bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button type="button" className="bg-white/10 text-white hover:bg-white/20" onClick={() => router.push("/admin/categories")}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
