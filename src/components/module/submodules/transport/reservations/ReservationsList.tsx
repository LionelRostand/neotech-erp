
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reservation } from '../types';
import EditReservationDialog from './EditReservationDialog';
import ViewReservationDetailsDialog from './ViewReservationDetailsDialog';
import { toast } from "sonner";

// Mock data pour les réservations
const mockReservations: Partial<Reservation>[] = [
  {
    id: "res001",
    clientName: "Marie Dupont",
    startDate: "2023-11-10", 
    endDate: "2023-11-12",
    pickupLocation: { address: "15 Rue de la Paix, Paris" },
    dropoffLocation: { address: "Charles de Gaulle Airport, Terminal 2E" },
    totalAmount: 320,
    status: "confirmed",
    paymentStatus: "paid",
    notes: "Client VIP, préférence siège avant",
    pickup: {
      address: "15 Rue de la Paix, Paris",
      datetime: "2023-11-10T09:00:00"
    },
    dropoff: {
      address: "Charles de Gaulle Airport, Terminal 2E",
      datetime: "2023-11-12T17:00:00"
    }
  },
  {
    id: "res002",
    clientName: "Pierre Dubois",
    startDate: "2023-11-15",
    endDate: "2023-11-15",
    pickupLocation: { address: "Aéroport CDG Terminal 2E, Paris" },
    dropoffLocation: { address: "25 rue du Faubourg Saint-Honoré, 75008 Paris" },
    status: "pending",
    paymentStatus: "pending",
    notes: "Location sans chauffeur",
    pickup: {
      address: "Aéroport CDG Terminal 2E, Paris",
      datetime: "2023-11-15T10:00:00"
    },
    dropoff: {
      address: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
      datetime: "2023-11-15T18:00:00"
    },
    totalAmount: 120
  },
  {
    id: "res003",
    clientName: "Sophie Laurent",
    startDate: "2023-11-08",
    endDate: "2023-11-10",
    pickupLocation: { address: "Gare de Lyon, Paris" },
    dropoffLocation: { address: "Gare de Lyon, Paris" },
    status: "completed",
    paymentStatus: "paid",
    notes: "Location sans chauffeur",
    pickup: {
      address: "Gare de Lyon, Paris",
      datetime: "2023-11-08T14:00:00"
    },
    dropoff: {
      address: "Gare de Lyon, Paris",
      datetime: "2023-11-10T12:00:00"
    },
    totalAmount: 320
  },
  {
    id: "res004",
    clientName: "Jean Moreau",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    pickupLocation: { address: "Hôtel Ritz, Place Vendôme, Paris" },
    dropoffLocation: { address: "Opéra Garnier, Paris" },
    status: "confirmed",
    paymentStatus: "partial",
    notes: "Location sans chauffeur",
    pickup: {
      address: "Hôtel Ritz, Place Vendôme, Paris",
      datetime: "2023-11-20T09:00:00"
    },
    dropoff: {
      address: "Opéra Garnier, Paris",
      datetime: "2023-11-20T19:00:00"
    },
    totalAmount: 180
  },
  {
    id: "res005",
    clientName: "Isabelle Bernard",
    startDate: "2023-11-25",
    endDate: "2023-11-27",
    pickupLocation: { address: "Gare Montparnasse, Paris" },
    dropoffLocation: { address: "Gare Montparnasse, Paris" },
    status: "pending",
    paymentStatus: "pending",
    notes: "Location sans chauffeur",
    pickup: {
      address: "Gare Montparnasse, Paris",
      datetime: "2023-11-25T10:00:00"
    },
    dropoff: {
      address: "Gare Montparnasse, Paris",
      datetime: "2023-11-27T18:00:00"
    },
    totalAmount: 420
  }
];

const ReservationsList: React.FC = () => {
  const [selectedReservation, setSelectedReservation] = useState<Partial<Reservation> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Format date string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get badge based on reservation status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };
  
  // Get badge based on payment status
  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payée</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Partielle</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const handleEditClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditDialogOpen(true);
    console.log("Opening edit dialog for reservation:", reservation.id);
  };

  const handleViewDetailsClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
  };

  const handleReservationUpdated = (updatedReservation: Reservation) => {
    toast.success(`Réservation ${updatedReservation.id} mise à jour avec succès`);
    // Here you would typically update the list or fetch fresh data
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.id}</TableCell>
                <TableCell>{reservation.clientName}</TableCell>
                <TableCell>{formatDate(reservation.startDate || '')}</TableCell>
                <TableCell>{formatDate(reservation.endDate || '')}</TableCell>
                <TableCell>{reservation.totalAmount} €</TableCell>
                <TableCell>{getStatusBadge(reservation.status || '')}</TableCell>
                <TableCell>{getPaymentBadge(reservation.paymentStatus || '')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(reservation as Reservation)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetailsClick(reservation as Reservation)}
                    >
                      Détails
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedReservation && (
        <>
          <EditReservationDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            reservation={selectedReservation as Reservation}
          />
          <ViewReservationDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            reservation={selectedReservation as Reservation}
          />
        </>
      )}
    </>
  );
};

export default ReservationsList;
