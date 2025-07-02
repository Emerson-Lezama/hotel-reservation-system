"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Bed, Users, LogOut, MapPin } from "lucide-react"

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
  available: boolean
  image: string
}

interface Reservation {
  id: string
  roomId: string
  roomNumber: string
  roomType: string
  checkIn: Date
  checkOut: Date
  guests: number
  total: number
  status: "confirmada" | "pendiente" | "cancelada"
}

const rooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "Habitación Simple",
    price: 80,
    capacity: 1,
    amenities: ["WiFi", "TV", "Aire Acondicionado"],
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    number: "201",
    type: "Habitación Doble",
    price: 120,
    capacity: 2,
    amenities: ["WiFi", "TV", "Aire Acondicionado", "Minibar"],
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    number: "301",
    type: "Suite Ejecutiva",
    price: 200,
    capacity: 4,
    amenities: ["WiFi", "TV", "Aire Acondicionado", "Minibar", "Jacuzzi", "Vista al Mar"],
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    number: "401",
    type: "Suite Presidencial",
    price: 350,
    capacity: 6,
    amenities: ["WiFi", "TV", "Aire Acondicionado", "Minibar", "Jacuzzi", "Vista al Mar", "Sala de Estar", "Cocina"],
    available: false,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function ClientDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      roomId: "2",
      roomNumber: "201",
      roomType: "Habitación Doble",
      checkIn: new Date("2024-01-15"),
      checkOut: new Date("2024-01-18"),
      guests: 2,
      total: 360,
      status: "confirmada",
    },
  ])

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleReservation = () => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      const total = days * selectedRoom.price

      const newReservation: Reservation = {
        id: Date.now().toString(),
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.number,
        roomType: selectedRoom.type,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        total,
        status: "pendiente",
      }

      setReservations([...reservations, newReservation])
      setIsBookingOpen(false)
      setSelectedRoom(null)
      setCheckInDate(undefined)
      setCheckOutDate(undefined)
      setGuests(1)
    }
  }

  const cancelReservation = (id: string) => {
    setReservations(reservations.map((res) => (res.id === id ? { ...res, status: "cancelada" as const } : res)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
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
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tierra Viva</h1>
                <p className="text-sm text-gray-500">Panel de Cliente</p>
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
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Habitaciones Disponibles</TabsTrigger>
            <TabsTrigger value="reservations">Mis Reservas</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Habitaciones Disponibles</h2>
              <Badge variant="secondary" className="text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                Centro de la Ciudad
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className={`overflow-hidden ${!room.available ? "opacity-60" : ""}`}>
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.type}
                      className="w-full h-full object-cover"
                    />
                    {!room.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive">No Disponible</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{room.type}</CardTitle>
                        <CardDescription>Habitación {room.number}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                        <p className="text-sm text-gray-500">por noche</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <Dialog open={isBookingOpen && selectedRoom?.id === room.id} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!room.available} onClick={() => setSelectedRoom(room)}>
                          {room.available ? "Reservar Ahora" : "No Disponible"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reservar {room.type}</DialogTitle>
                          <DialogDescription>
                            Habitación {room.number} - ${room.price} por noche
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Fecha de Entrada</Label>
                              <Input
                                type="date"
                                value={checkInDate ? checkInDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => setCheckInDate(new Date(e.target.value))}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div>
                              <Label>Fecha de Salida</Label>
                              <Input
                                type="date"
                                value={checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                                min={
                                  checkInDate
                                    ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                                    : new Date().toISOString().split("T")[0]
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="guests">Número de Huéspedes</Label>
                            <Input
                              id="guests"
                              type="number"
                              min="1"
                              max={room.capacity}
                              value={guests}
                              onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                            />
                          </div>

                          {checkInDate && checkOutDate && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Noches:</span>
                                  <span>
                                    {Math.ceil(
                                      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Precio por noche:</span>
                                  <span>${room.price}</span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2">
                                  <span className="font-medium">Total:</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    $
                                    {Math.ceil(
                                      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
                                    ) * room.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={handleReservation}
                            className="w-full"
                            disabled={!checkInDate || !checkOutDate}
                          >
                            Confirmar Reserva
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>

            {reservations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">No tienes reservas</p>
                  <p className="text-gray-500 text-center">
                    Explora nuestras habitaciones disponibles y haz tu primera reserva.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {reservation.roomType}
                            <Badge className={getStatusColor(reservation.status)}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Habitación {reservation.roomNumber} • Reserva #{reservation.id}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">${reservation.total}</p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Check-in</p>
                            <p className="text-sm text-gray-600">{reservation.checkIn.toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Check-out</p>
                            <p className="text-sm text-gray-600">{reservation.checkOut.toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Huéspedes</p>
                            <p className="text-sm text-gray-600">{reservation.guests}</p>
                          </div>
                        </div>
                      </div>

                      {reservation.status === "confirmada" && (
                        <div className="mt-4 pt-4 border-t">
                          <Button variant="destructive" size="sm" onClick={() => cancelReservation(reservation.id)}>
                            Cancelar Reserva
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
