"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const username = (form.elements.namedItem("username") as HTMLInputElement)?.value
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value

    fetch("http://localhost:8000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok || data?.success === false) {
          const msg = Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors.join(", ")
            : "Erreur de connexion"
          throw new Error(msg)
        }
        // Success: store token and redirect
        if (data?.token) {
          try {
            localStorage.setItem("admin_token", data.token as string)
          } catch {}
        }
        router.push("/admin/dashboard")
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erreur de connexion"
        setError(msg)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-[100svh] bg-[#06080d] text-white relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-16 h-96 w-96 rounded-full bg-[#0db9b5]/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 py-10">
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/10">
            <Image src="/logo.png" alt="UrbanSpace" width={40} height={40} className="h-10 w-10 object-cover" priority />
          </div>
          <span className="text-2xl font-semibold tracking-tight">UrbanSpace Admin</span>
        </div>

        {/* Card */}
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <span className="text-white">Connexion </span>
              <span className="text-[#0db9b5]">administrateur</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#0db9b5]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-10 focus-visible:ring-[#0db9b5]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-white/60 hover:text-white"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-2.228-2.228a12.317 12.317 0 0 0 3.118-3.826.75.75 0 0 0 0-.708C20.949 8.182 16.753 5.25 12 5.25a9.735 9.735 0 0 0-3.7.703L3.53 2.47Z" />
                        <path d="M14.47 15.41 9.91 10.85a3 3 0 0 0 4.56 4.56Z" />
                        <path d="M12 6.75c4.204 0 7.87 2.412 10.21 6.513a10.79 10.79 0 0 1-3.127 3.422l-2.223-2.223a5.25 5.25 0 0 0-7.322-7.322L7.95 5.202A11.28 11.28 0 0 1 12 6.75Z" />
                        <path d="M3.53 6.672 5.75 8.89a10.787 10.787 0 0 0-3 4.373.75.75 0 0 0 0 .708C5.251 17.818 9.447 20.75 14.2 20.75c1.299 0 2.56-.19 3.76-.548l1.2 1.2a12.78 12.78 0 0 1-3.96.598c-4.753 0-8.949-2.932-12.05-7.079a9.802 9.802 0 0 1 2.381-3.032L3.53 6.672Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 5.25c-4.753 0-8.949 2.932-12.05 7.079a.75.75 0 0 0 0 .708C3.051 17.182 7.247 20.114 12 20.114c4.753 0 8.949-2.932 12.05-7.079a.75.75 0 0 0 0-.708C20.949 8.182 16.753 5.25 12 5.25Zm0 12.614A4.864 4.864 0 0 1 7.136 13c0-2.687 2.176-4.864 4.864-4.864S16.864 10.313 16.864 13 14.687 17.864 12 17.864Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
                  Se souvenir de moi
                </label>
                <a href="#" className="text-[#0db9b5] hover:text-[#0db9b5]/80">Mot de passe oublié ?</a>
              </div>

              <Button type="submit" className="w-full bg-[#0db9b5] text-black hover:bg-[#0db9b5]/90" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-white/50">
              Accès réservé à l'équipe d'administration UrbanSpace.
            </p>
          </CardContent>
        </Card>

        {/* Decorative Grid */}
        <div className="pointer-events-none mt-14 grid grid-cols-12 gap-2 opacity-10">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="h-6 rounded border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}
