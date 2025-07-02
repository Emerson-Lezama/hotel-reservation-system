"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hotel } from "lucide-react"
import ClientDashboard from "@/components/client-dashboard"
import ReceptionistDashboard from "@/components/receptionist-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

type UserRole = "cliente" | "recepcionista" | "administrador"

interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export default function HotelReservationSystem() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "" as UserRole | "",
  })

  // Usuarios de prueba
  const testUsers = {
    cliente: { id: "1", name: "Juan Pérez", email: "juan@cliente", role: "cliente" as UserRole },
    recepcionista: { id: "2", name: "María García", email: "maria@recepcionista", role: "recepcionista" as UserRole },
    administrador: { id: "3", name: "Carlos Admin", email: "carlos@administrador", role: "administrador" as UserRole },
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email && loginForm.password) {
      // Detect role from email domain
      let role: UserRole
      if (loginForm.email.includes("@cliente")) {
        role = "cliente"
      } else if (loginForm.email.includes("@recepcionista")) {
        role = "recepcionista"
      } else if (loginForm.email.includes("@administrador")) {
        role = "administrador"
      } else {
        alert("Email debe contener @cliente, @recepcionista o @administrador")
        return
      }

      setCurrentUser(testUsers[role])
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setLoginForm({ email: "", password: "", role: "" })
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Hotel className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Sistema de Reservas</CardTitle>
            <CardDescription>Tierra Viva - Acceso al Sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@cliente / usuario@recepcionista / usuario@administrador"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === "cliente" && <ClientDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === "recepcionista" && <ReceptionistDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === "administrador" && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  )
}
