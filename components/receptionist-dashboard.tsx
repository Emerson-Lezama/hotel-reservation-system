"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Users, LogOut, Search, CheckCircle, XCircle, Bed, TrendingUp } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Reservation {
  id: string
  guestName: string
  guestEmail: string
  roomNumber: string
  roomType: string
  checkIn: Date
  checkOut: Date
  guests: number
  total: number
  status: "confirmada" | "pendiente" | "cancelada" | "check-in" | "check-out"
}

interface Room {
  id: string
  number: string
  type: string
  status: "disponible" | "ocupada" | "mantenimiento" | "limpieza"
  guest?: string
}

export default function ReceptionistDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      guestName: "Juan Pérez",
      guestEmail: "juan@email.com",
      roomNumber: "201",
      roomType: "Habitación Doble",
      checkIn: new Date("2024-01-15"),
      checkOut: new Date("2024-01-18"),
      guests: 2,
      total: 360,
      status: "confirmada",
    },
    {
      id: "2",
      guestName: "María González",
      guestEmail: "maria@email.com",
      roomNumber: "301",
      roomType: "Suite Ejecutiva",
      checkIn: new Date("2024-01-16"),
      checkOut: new Date("2024-01-20"),
      guests: 3,
      total: 800,
      status: "check-in",
    },
    {
      id: "3",
      guestName: "Carlos López",
      guestEmail: "carlos@email.com",
      roomNumber: "101",
      roomType: "Habitación Simple",
      checkIn: new Date("2024-01-14"),
      checkOut: new Date("2024-01-16"),
      guests: 1,
      total: 160,
      status: "pendiente",
    },
  ])

  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", number: "101", type: "Simple", status: "disponible" },
    { id: "2", number: "102", type: "Simple", status: "limpieza" },
    { id: "3", number: "201", type: "Doble", status: "disponible" },
    { id: "4", number: "202", type: "Doble", status: "ocupada", guest: "Juan Pérez" },
    { id: "5", number: "301", type: "Suite", status: "ocupada", guest: "María González" },
    { id: "6", number: "302", type: "Suite", status: "mantenimiento" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const handleCheckIn = (reservationId: string) => {
    setReservations(
      reservations.map((res) => (res.id === reservationId ? { ...res, status: "check-in" as const } : res)),
    )

    const reservation = reservations.find((res) => res.id === reservationId)
    if (reservation) {
      setRooms(
        rooms.map((room) =>
          room.number === reservation.roomNumber
            ? { ...room, status: "ocupada" as const, guest: reservation.guestName }
            : room,
        ),
      )
    }
  }

  const handleCheckOut = (reservationId: string) => {
    setReservations(
      reservations.map((res) => (res.id === reservationId ? { ...res, status: "check-out" as const } : res)),
    )

    const reservation = reservations.find((res) => res.id === reservationId)
    if (reservation) {
      setRooms(
        rooms.map((room) =>
          room.number === reservation.roomNumber ? { ...room, status: "limpieza" as const, guest: undefined } : room,
        ),
      )
    }
  }

  const updateReservationStatus = (reservationId: string, newStatus: Reservation["status"]) => {
    setReservations(reservations.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res)))
  }

  const updateRoomStatus = (roomId: string, newStatus: Room["status"]) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, status: newStatus } : room)))
  }

  const filteredReservations = reservations.filter(
    (res) =>
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.roomNumber.includes(searchTerm) ||
      res.id.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      case "check-in":
        return "bg-blue-100 text-blue-800"
      case "check-out":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoomStatusColor = (status: string) => {
    switch (status) {
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

  const stats = {
    totalReservations: reservations.length,
    checkInsToday: reservations.filter((res) => res.status === "confirmada").length,
    checkOutsToday: reservations.filter((res) => res.status === "check-in").length,
    occupiedRooms: rooms.filter((room) => room.status === "ocupada").length,
    availableRooms: rooms.filter((room) => room.status === "disponible").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tierra Viva</h1>
                <p className="text-sm text-gray-500">Panel de Recepción</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Check-ins Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.checkInsToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Check-outs Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.checkOutsToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ocupadas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reservations">Gestión de Reservas</TabsTrigger>
            <TabsTrigger value="rooms">Estado de Habitaciones</TabsTrigger>
            <TabsTrigger value="checkin">Check-in/Check-out</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar reservas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Huésped</TableHead>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">#{reservation.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.guestName}</p>
                          <p className="text-sm text-gray-500">{reservation.guestEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.roomNumber}</p>
                          <p className="text-sm text-gray-500">{reservation.roomType}</p>
                        </div>
                      </TableCell>
                      <TableCell>{reservation.checkIn.toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.checkOut.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${reservation.total}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              Gestionar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gestionar Reserva #{reservation.id}</DialogTitle>
                              <DialogDescription>
                                {reservation.guestName} - {reservation.roomType}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Cambiar Estado</Label>
                                <Select
                                  value={reservation.status}
                                  onValueChange={(value: Reservation["status"]) =>
                                    updateReservationStatus(reservation.id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="confirmada">Confirmada</SelectItem>
                                    <SelectItem value="check-in">Check-in</SelectItem>
                                    <SelectItem value="check-out">Check-out</SelectItem>
                                    <SelectItem value="cancelada">Cancelada</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Huéspedes</Label>
                                  <p className="text-sm text-gray-600">{reservation.guests}</p>
                                </div>
                                <div>
                                  <Label>Total</Label>
                                  <p className="text-sm font-medium">${reservation.total}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Estado de Habitaciones</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Habitación {room.number}</CardTitle>
                        <CardDescription>{room.type}</CardDescription>
                      </div>
                      <Badge className={getRoomStatusColor(room.status)}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {room.guest && (
                      <div>
                        <Label>Huésped Actual</Label>
                        <p className="text-sm font-medium">{room.guest}</p>
                      </div>
                    )}

                    <div>
                      <Label>Cambiar Estado</Label>
                      <Select
                        value={room.status}
                        onValueChange={(value: Room["status"]) => updateRoomStatus(room.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="ocupada">Ocupada</SelectItem>
                          <SelectItem value="limpieza">En Limpieza</SelectItem>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checkin" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Check-in / Check-out</h2>

            <div className="grid gap-6">
              {reservations
                .filter((res) => res.status === "confirmada" || res.status === "check-in")
                .map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {reservation.guestName}
                            <Badge className={getStatusColor(reservation.status)}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {reservation.roomType} - Habitación {reservation.roomNumber}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${reservation.total}</p>
                          <p className="text-sm text-gray-500">{reservation.guests} huéspedes</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Check-in</Label>
                          <p className="text-sm">{reservation.checkIn.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label>Check-out</Label>
                          <p className="text-sm">{reservation.checkOut.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm">{reservation.guestEmail}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {reservation.status === "confirmada" && (
                          <Button onClick={() => handleCheckIn(reservation.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Realizar Check-in
                          </Button>
                        )}
                        {reservation.status === "check-in" && (
                          <Button variant="outline" onClick={() => handleCheckOut(reservation.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Realizar Check-out
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
