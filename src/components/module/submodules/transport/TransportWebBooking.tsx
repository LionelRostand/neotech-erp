
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Globe, Settings, Users, Calendar, Car, MapPin } from 'lucide-react';
import { WebBooking } from './types/reservation-types';
import { TransportService } from './types/base-types';

const TransportWebBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [formConfig, setFormConfig] = useState({
    enableDriverSelection: true,
    requireUserAccount: false,
    enablePaymentOnline: true,
    defaultService: 'airport' as TransportService,
    requirePhoneNumber: true,
    advanceBookingHours: 3,
    maxBookingDaysInFuture: 30,
    displayPricing: true
  });

  const [mockRecentBookings] = useState<WebBooking[]>([
    {
      id: "wb-1001",
      service: "airport" as TransportService,
      date: "2023-09-25",
      time: "14:30",
      pickup: "34 Avenue de la République, Paris",
      dropoff: "Aéroport Charles de Gaulle, Terminal 2E",
      clientInfo: {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        phone: "+33612345678"
      },
      passengers: 2,
      vehicleType: "sedan",
      needsDriver: true,
      status: "confirmed",
      createdAt: "2023-09-20T10:15:00Z"
    },
    {
      id: "wb-1002",
      service: "hourly" as TransportService,
      date: "2023-09-27",
      time: "09:00",
      pickup: "16 Rue de Rivoli, Paris",
      dropoff: "Multiple destinations",
      clientInfo: {
        firstName: "Marie",
        lastName: "Laurent",
        email: "marie.laurent@example.com",
        phone: "+33623456789"
      },
      passengers: 4,
      vehicleType: "van",
      needsDriver: true,
      status: "new",
      createdAt: "2023-09-23T16:45:00Z"
    }
  ]);

  const handleConfigChange = (key: string, value: any) => {
    setFormConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold">Réservation Web</h2>
        <p className="text-muted-foreground">
          Configurez et gérez le système de réservation en ligne pour vos clients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut du module</CardTitle>
          <CardDescription>
            Le module de réservation web est actif et disponible pour vos clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Actif</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurer l'intégration
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="configuration" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="configuration">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="formulaire">
            <Globe className="mr-2 h-4 w-4" />
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="mr-2 h-4 w-4" />
            Réservations
          </TabsTrigger>
          <TabsTrigger value="integration">
            <Users className="mr-2 h-4 w-4" />
            Intégration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les options principales du système de réservation en ligne.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="driver-selection">Sélection de chauffeur</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux clients de choisir s'ils souhaitent un chauffeur
                  </p>
                </div>
                <Switch 
                  id="driver-selection" 
                  checked={formConfig.enableDriverSelection}
                  onCheckedChange={(checked) => handleConfigChange('enableDriverSelection', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-account">Compte utilisateur requis</Label>
                  <p className="text-sm text-muted-foreground">
                    Obliger les clients à créer un compte pour réserver
                  </p>
                </div>
                <Switch 
                  id="require-account" 
                  checked={formConfig.requireUserAccount}
                  onCheckedChange={(checked) => handleConfigChange('requireUserAccount', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="online-payment">Paiement en ligne</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le paiement en ligne lors de la réservation
                  </p>
                </div>
                <Switch 
                  id="online-payment" 
                  checked={formConfig.enablePaymentOnline}
                  onCheckedChange={(checked) => handleConfigChange('enablePaymentOnline', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-service">Service par défaut</Label>
                  <Select 
                    value={formConfig.defaultService} 
                    onValueChange={(value) => handleConfigChange('defaultService', value)}
                  >
                    <SelectTrigger id="default-service">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airport">Transfert aéroport</SelectItem>
                      <SelectItem value="hourly">Service à l'heure</SelectItem>
                      <SelectItem value="pointToPoint">Point à point</SelectItem>
                      <SelectItem value="dayTour">Excursion journée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="booking-hours">Heures minimum avant réservation</Label>
                  <Input 
                    id="booking-hours" 
                    type="number" 
                    value={formConfig.advanceBookingHours}
                    onChange={(e) => handleConfigChange('advanceBookingHours', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="formulaire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation du formulaire</CardTitle>
              <CardDescription>
                Configurez les champs et l'apparence du formulaire de réservation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Champs requis</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-phone">Numéro de téléphone</Label>
                    <Switch 
                      id="require-phone" 
                      checked={formConfig.requirePhoneNumber}
                      onCheckedChange={(checked) => handleConfigChange('requirePhoneNumber', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-pricing">Afficher les prix</Label>
                    <Switch 
                      id="display-pricing" 
                      checked={formConfig.displayPricing}
                      onCheckedChange={(checked) => handleConfigChange('displayPricing', checked)}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-6">
                  <h3 className="text-lg font-medium mb-4">Aperçu du formulaire</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 border rounded-md">
                      <Car className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Type de véhicule</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Date et heure</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Adresses</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Informations client</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
              <CardDescription>
                Consultez les réservations effectuées via le portail web.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Client</th>
                      <th className="py-3 px-4 text-left font-medium">Service</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentBookings.map(booking => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{booking.id}</td>
                        <td className="py-3 px-4">{`${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`}</td>
                        <td className="py-3 px-4">
                          {booking.service === "airport" ? 'Transfert aéroport' : 
                           booking.service === "hourly" ? 'Service à l\'heure' : 
                           booking.service === "pointToPoint" ? 'Point à point' : 'Excursion journée'}
                        </td>
                        <td className="py-3 px-4">{`${booking.date} ${booking.time}`}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmée' : 
                             booking.status === 'new' ? 'Nouvelle' : 
                             booking.status === 'cancelled' ? 'Annulée' : 'Inconnue'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégration</CardTitle>
              <CardDescription>
                Configurez l'intégration du formulaire de réservation sur votre site web.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Code d'intégration</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`<iframe src="https://votre-domaine.com/reservations-transport" 
        width="100%" 
        height="650" 
        frameborder="0">
</iframe>`}
                  </pre>
                </div>
                <Button variant="outline" size="sm">
                  Copier le code
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personnalisation</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="integration-width">Largeur (px ou %)</Label>
                    <Input id="integration-width" defaultValue="100%" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="integration-height">Hauteur (px)</Label>
                    <Input id="integration-height" defaultValue="650" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Conseil d'intégration</h4>
                <p className="text-sm text-muted-foreground">
                  Pour une expérience optimale, nous recommandons de placer le formulaire de réservation sur une page dédiée de votre site web avec une largeur minimale de 600px.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportWebBooking;
