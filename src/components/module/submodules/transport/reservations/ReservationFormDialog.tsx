
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TransportService, TransportReservation, TransportReservationStatus, getAddressString, stringToService, serviceToString } from '../types';
import { useToast } from "@/hooks/use-toast";

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: TransportReservation;
  onSubmit: (reservation: Partial<TransportReservation>) => void;
}

const ReservationFormDialog: React.FC<ReservationFormDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onSubmit
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    service: 'airport',
    date: new Date(),
    time: '09:00',
    pickupAddress: '',
    dropoffAddress: '',
    price: 0,
    isPaid: false,
    needsDriver: true,
    driverId: '',
    notes: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        clientId: reservation.clientId || '',
        vehicleId: reservation.vehicleId || '',
        service: getServiceString(reservation.service),
        date: reservation.date ? new Date(reservation.date) : new Date(),
        time: reservation.time || '09:00',
        pickupAddress: getAddressValue(reservation.pickup),
        dropoffAddress: getAddressValue(reservation.dropoff),
        price: reservation.price || 0,
        isPaid: reservation.isPaid || false,
        needsDriver: reservation.needsDriver || true,
        driverId: reservation.driverId || '',
        notes: getNoteString(reservation.notes)
      });
    }
  }, [reservation]);

  const getServiceString = (service?: TransportService | { name: string } | string): string => {
    if (!service) return 'airport';
    if (typeof service === 'object' && 'name' in service) return service.name;
    if (typeof service === 'string') return service;
    return serviceToString(service);
  };

  const getAddressValue = (address?: string | { address: string }): string => {
    if (!address) return '';
    if (typeof address === 'object' && 'address' in address) return address.address;
    return address;
  };

  const getNoteString = (notes?: string | any[]): string => {
    if (!notes) return '';
    if (typeof notes === 'string') return notes;
    if (Array.isArray(notes) && notes.length > 0) {
      const firstNote = notes[0];
      if (typeof firstNote === 'object' && 'content' in firstNote) {
        return firstNote.content;
      }
    }
    return '';
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reservationData = prepareReservationData(formData);

    onSubmit(reservationData);

    toast({
      title: "Réservation enregistrée",
      description: "La réservation a été enregistrée avec succès.",
    });

    onOpenChange(false);
  };

  const prepareReservationData = (formData: any) => {
    const notes = typeof formData.notes === 'string' && formData.notes.length > 0 
      ? [{ content: formData.notes }] 
      : formData.notes;
      
    return {
      ...formData,
      service: stringToService(formData.service), // Convert string to TransportService
      pickup: formData.pickupAddress,
      dropoff: formData.dropoffAddress,
      notes: notes
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{reservation ? "Modifier Réservation" : "Créer une Réservation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="clientId">Client</Label>
              <Input
                type="text"
                id="clientId"
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vehicleId">Véhicule</Label>
              <Input
                type="text"
                id="vehicleId"
                value={formData.vehicleId}
                onChange={(e) => handleChange('vehicleId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airport">Aéroport</SelectItem>
                  <SelectItem value="hourly">Horaire</SelectItem>
                  <SelectItem value="pointToPoint">Point à Point</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP", { locale: fr }) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={fr}
                      selected={formData.date}
                      onSelect={(date) => handleChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Heure</Label>
                <Input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pickupAddress">Adresse de prise en charge</Label>
              <Input
                type="text"
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleChange('pickupAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dropoffAddress">Adresse de dépose</Label>
              <Input
                type="text"
                id="dropoffAddress"
                value={formData.dropoffAddress}
                onChange={(e) => handleChange('dropoffAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) => handleChange('isPaid', checked)}
              />
              <Label htmlFor="isPaid">Payé</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="needsDriver"
                checked={formData.needsDriver}
                onCheckedChange={(checked) => handleChange('needsDriver', checked)}
              />
              <Label htmlFor="needsDriver">Besoin d'un chauffeur</Label>
            </div>
            {formData.needsDriver && (
              <div>
                <Label htmlFor="driverId">Chauffeur</Label>
                <Input
                  type="text"
                  id="driverId"
                  value={formData.driverId}
                  onChange={(e) => handleChange('driverId', e.target.value)}
                />
              </div>
            )}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {reservation ? "Modifier la réservation" : "Créer la réservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationFormDialog;
