"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Users,
  Bed,
  TrendingUp,
  DollarSign,
  LogOut,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Room {
  id: string
  number: string
  type: string
  price: number
  capacity: number
  amenities: string[]
  status: "disponible" | "ocupada" | "mantenimiento" | "limpieza"
  description: string
}

interface SystemUser {
  id: string
  name: string
  email: string
  role: "cliente" | "recepcionista" | "administrador"
  status: "activo" | "inactivo"
  createdAt: Date
}

interface Report {
  totalRevenue: number
  occupancyRate: number
  totalReservations: number
  averageStay: number
  monthlyRevenue: number[]
  roomTypeStats: { type: string; bookings: number; revenue: number }[]
}

export default function AdminDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      number: "101",
      type: "Habitación Simple",
      price: 80,
      capacity: 1,
      amenities: ["WiFi", "TV", "Aire Acondicionado"],
      status: "disponible",
      description: "Habitación cómoda para una persona con todas las comodidades básicas.",
    },
    {
      id: "2",
      number: "201",
      type: "Habitación Doble",
      price: 120,
      capacity: 2,
      amenities: ["WiFi", "TV", "Aire Acondicionado", "Minibar"],
      status: "ocupada",
      description: "Habitación espaciosa para dos personas con minibar incluido.",
    },
    {
      id: "3",
      number: "301",
      type: "Suite Ejecutiva",
      price: 200,
      capacity: 4,
      amenities: ["WiFi", "TV", "Aire Acondicionado", "Minibar", "Jacuzzi", "Vista al Mar"],
      status: "disponible",
      description: "Suite de lujo con jacuzzi y vista panorámica al mar.",
    },
  ])

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "cliente@hotel.com",
      role: "cliente",
      status: "activo",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "María García",
      email: "recepcion@hotel.com",
      role: "recepcionista",
      status: "activo",
      createdAt: new Date("2024-01-05"),
    },
    {
      id: "3",
      name: "Carlos Admin",
      email: "admin@hotel.com",
      role: "administrador",
      status: "activo",
      createdAt: new Date("2024-01-01"),
    },
  ])

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isNewRoom, setIsNewRoom] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const [roomForm, setRoomForm] = useState({
    number: "",
    type: "",
    price: 0,
    capacity: 1,
    amenities: "",
    description: "",
  })

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "cliente" as SystemUser["role"],
  })

  const report: Report = {
    totalRevenue: 15420,
    occupancyRate: 78,
    totalReservations: 156,
    averageStay: 3.2,
    monthlyRevenue: [8500, 9200, 10100, 11500, 12800, 15420],
    roomTypeStats: [
      { type: "Simple", bookings: 45, revenue: 3600 },
      { type: "Doble", bookings: 67, revenue: 8040 },
      { type: "Suite", bookings: 44, revenue: 8800 },
    ],
  }

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amenitiesArray = roomForm.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a)

    if (isNewRoom) {
      const newRoom: Room = {
        id: Date.now().toString(),
        number: roomForm.number,
        type: roomForm.type,
        price: roomForm.price,
        capacity: roomForm.capacity,
        amenities: amenitiesArray,
        status: "disponible",
        description: roomForm.description,
      }
      setRooms([...rooms, newRoom])
    } else if (selectedRoom) {
      setRooms(
        rooms.map((room) => (room.id === selectedRoom.id ? { ...room, ...roomForm, amenities: amenitiesArray } : room)),
      )
    }

    setIsRoomDialogOpen(false)
    setRoomForm({ number: "", type: "", price: 0, capacity: 1, amenities: "", description: "" })
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNewUser) {
      const newUser: SystemUser = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: "activo",
        createdAt: new Date(),
      }
      setSystemUsers([...systemUsers, newUser])
    } else if (selectedUser) {
      setSystemUsers(systemUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...userForm } : user)))
    }

    setIsUserDialogOpen(false)
    setUserForm({ name: "", email: "", role: "cliente" })
  }

  const deleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId))
  }

  const toggleUserStatus = (userId: string) => {
    setSystemUsers(
      systemUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "activo" ? ("inactivo" as const) : ("activo" as const) }
          : user,
      ),
    )
  }

  const openRoomDialog = (room?: Room) => {
    if (room) {
      setSelectedRoom(room)
      setRoomForm({
        number: room.number,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities.join(", "),
        description: room.description,
      })
      setIsNewRoom(false)
    } else {
      setSelectedRoom(null)
      setRoomForm({ number: "", type: "", price: 0, capacity: 1, amenities: "", description: "" })
      setIsNewRoom(true)
    }
    setIsRoomDialogOpen(true)
  }

  const openUserDialog = (user?: SystemUser) => {
    if (user) {
      setSelectedUser(user)
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
      })
      setIsNewUser(false)
    } else {
      setSelectedUser(null)
      setUserForm({ name: "", email: "", role: "cliente" })
      setIsNewUser(true)
    }
    setIsUserDialogOpen(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrador":
        return "bg-red-100 text-red-800"
      case "recepcionista":
        return "bg-blue-100 text-blue-800"
      case "cliente":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-red-100 text-red-800"
      case "disponible":
        return "bg-green-100 text-green-800"
      case "ocupada":
        return "bg-red-100 text-red-800"
      case "mantenimiento":
        return "bg-orange-100 text-orange-800"
      case "limpieza":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tierra Viva</h1>
                <p className="text-sm text-gray-500">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">${report.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ocupación</p>
                  <p className="text-2xl font-bold text-gray-900">{report.occupancyRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{report.totalReservations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estancia Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{report.averageStay} días</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="rooms">Gestión de Habitaciones</TabsTrigger>
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Ingresos por Tipo de Habitación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.roomTypeStats.map((stat) => (
                      <div key={stat.type} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{stat.type}</p>
                          <p className="text-sm text-gray-500">{stat.bookings} reservas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${stat.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Ingresos del Mes:</span>
                      <span className="font-bold">${report.monthlyRevenue[5].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crecimiento:</span>
                      <span className="font-bold text-green-600">+20.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitaciones Totales:</span>
                      <span className="font-bold">{rooms.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usuarios Activos:</span>
                      <span className="font-bold">{systemUsers.filter((u) => u.status === "activo").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h2>
              <Button onClick={() => openRoomDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Habitación
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Habitación {room.number}</CardTitle>
                        <CardDescription>{room.type}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(room.status)}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                      <p className="text-sm text-gray-500">por noche</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      Hasta {room.capacity} huéspedes
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">{room.description}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openRoomDialog(room)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteRoom(room.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{isNewRoom ? "Nueva Habitación" : "Editar Habitación"}</DialogTitle>
                  <DialogDescription>
                    {isNewRoom ? "Crear una nueva habitación en el hotel" : "Modificar los datos de la habitación"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRoomSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={roomForm.number}
                        onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={roomForm.type}
                        onValueChange={(value) => setRoomForm({ ...roomForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Habitación Simple">Habitación Simple</SelectItem>
                          <SelectItem value="Habitación Doble">Habitación Doble</SelectItem>
                          <SelectItem value="Suite Ejecutiva">Suite Ejecutiva</SelectItem>
                          <SelectItem value="Suite Presidencial">Suite Presidencial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Precio por Noche</Label>
                      <Input
                        id="price"
                        type="number"
                        value={roomForm.price}
                        onChange={(e) => setRoomForm({ ...roomForm, price: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacidad</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="amenities">Amenidades (separadas por coma)</Label>
                    <Input
                      id="amenities"
                      value={roomForm.amenities}
                      onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                      placeholder="WiFi, TV, Aire Acondicionado"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={roomForm.description}
                      onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      placeholder="Descripción de la habitación"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {isNewRoom ? "Crear Habitación" : "Guardar Cambios"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <Button onClick={() => openUserDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openUserDialog(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={user.status === "activo" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "activo" ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{isNewUser ? "Nuevo Usuario" : "Editar Usuario"}</DialogTitle>
                  <DialogDescription>
                    {isNewUser ? "Crear un nuevo usuario del sistema" : "Modificar los datos del usuario"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Nombre</Label>
                    <Input
                      id="userName"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="userRole">Rol</Label>
                    <Select
                      value={userForm.role}
                      onValueChange={(value: SystemUser["role"]) => setUserForm({ ...userForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    {isNewUser ? "Crear Usuario" : "Guardar Cambios"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>Configuraciones básicas del hotel y sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre del Hotel</Label>
                      <Input defaultValue="Tierra Viva" />
                    </div>
                    <div>
                      <Label>Dirección</Label>
                      <Input defaultValue="Av. Principal 123, Centro" />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input defaultValue="+1 234 567 8900" />
                    </div>
                    <div>
                      <Label>Email de Contacto</Label>
                      <Input defaultValue="info@tierraviva.com" />
                    </div>
                  </div>
                  <Button>Guardar Configuración</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Políticas del Hotel</CardTitle>
                  <CardDescription>Configurar políticas de reserva y cancelación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in</Label>
                      <Input defaultValue="15:00" type="time" />
                    </div>
                    <div>
                      <Label>Check-out</Label>
                      <Input defaultValue="11:00" type="time" />
                    </div>
                    <div>
                      <Label>Cancelación Gratuita (horas)</Label>
                      <Input defaultValue="24" type="number" />
                    </div>
                    <div>
                      <Label>Depósito Requerido (%)</Label>
                      <Input defaultValue="20" type="number" />
                    </div>
                  </div>
                  <Button>Actualizar Políticas</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respaldo y Mantenimiento</CardTitle>
                  <CardDescription>Herramientas de administración del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button variant="outline">Crear Respaldo</Button>
                    <Button variant="outline">Limpiar Logs</Button>
                    <Button variant="outline">Exportar Datos</Button>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Último respaldo:</strong> 15 de Enero, 2024 - 02:30 AM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
