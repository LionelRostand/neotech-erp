import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, AlertTriangle, Navigation, Bell, Search, Settings, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TransportVehicleWithLocation, VehicleLocation } from './types/map-types';
import { useTransportMap } from './hooks/useTransportMap';
import VehicleDetailsDialog from './geolocation/VehicleDetailsDialog';
import AlertConfigDialog from './geolocation/AlertConfigDialog';
import AlertDetailsDialog from './geolocation/AlertDetailsDialog';

const mockVehicleLocations: TransportVehicleWithLocation[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    licensePlate: "AB-123-CD",
    status: "active",
    location: {
      id: "loc-001",
      vehicleId: "veh-001",
      latitude: 48.8584,
      longitude: 2.2945,
      timestamp: "2023-11-08T10:15:30Z",
      speed: 35,
      heading: 90,
      status: "moving",
      lastUpdate: "2023-11-08T10:15:30Z"
    }
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    licensePlate: "EF-456-GH",
    status: "active",
    location: {
      id: "loc-002",
      vehicleId: "veh-002",
      latitude: 48.8738,
      longitude: 2.2950,
      timestamp: "2023-11-08T10:10:15Z",
      speed: 0,
      heading: 180,
      status: "stopped",
      lastUpdate: "2023-11-08T10:10:15Z"
    }
  },
  {
    id: "veh-003",
    name: "Audi A6",
    type: "sedan",
    licensePlate: "IJ-789-KL",
    status: "maintenance",
    location: {
      id: "loc-003",
      vehicleId: "veh-003",
      latitude: 48.8600,
      longitude: 2.3400,
      timestamp: "2023-11-08T09:45:00Z",
      speed: 0,
      heading: 0,
      status: "idle",
      lastUpdate: "2023-11-08T09:45:00Z"
    }
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    licensePlate: "MN-012-OP",
    status: "active",
    location: {
      id: "loc-004",
      vehicleId: "veh-004",
      latitude: 48.8474,
      longitude: 2.3520,
      timestamp: "2023-11-08T10:18:45Z",
      speed: 28,
      heading: 270,
      status: "moving",
      lastUpdate: "2023-11-08T10:18:45Z"
    }
  }
];

const mockAlerts = [
  { 
    id: 'a1', 
    vehicleId: 'veh-004', 
    vehicleName: 'BMW Série 5', 
    licensePlate: 'EF-456-GH', 
    type: 'unauthorized', 
    message: 'Utilisation en dehors des heures de service', 
    timestamp: '2023-06-01T02:14:00', 
    status: 'unresolved',
    location: { lat: 48.8584, lng: 2.2945 }
  },
  { 
    id: 'a2', 
    vehicleId: 'veh-001', 
    vehicleName: 'Mercedes Classe E', 
    licensePlate: 'AB-123-CD', 
    type: 'speeding', 
    message: 'Excès de vitesse: 95 km/h en zone 50', 
    timestamp: '2023-06-01T11:23:00', 
    status: 'resolved',
    speed: 95,
    speedLimit: 50
  },
  { 
    id: 'a3', 
    vehicleId: 'veh-002', 
    vehicleName: 'Tesla Model S', 
    licensePlate: 'EF-456-GH', 
    type: 'geofence', 
    message: 'Véhicule hors zone autorisée', 
    timestamp: '2023-06-01T09:45:00', 
    status: 'unresolved',
    location: { lat: 48.8584, lng: 2.2945 }
  }
];

const mockRoutes = [
  {
    id: 'r1',
    vehicleId: 'veh-001',
    vehicleName: 'Mercedes Classe E',
    currentRoute: 'Paris Centre → Orly Airport',
    optimizedRoute: 'Paris Centre → A6 → Orly Airport',
    savingsMinutes: 12,
    savingsKm: 5.4,
    applied: false
  },
  {
    id: 'r2',
    vehicleId: 'veh-004',
    vehicleName: 'BMW Série 5',
    currentRoute: 'Montmartre → Tour Eiffel',
    optimizedRoute: 'Montmartre → Opéra → Tour Eiffel',
    savingsMinutes: 8,
    savingsKm: 2.3,
    applied: false
  }
];

const TransportGeolocation = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [routes, setRoutes] = useState(mockRoutes);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);
  const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);
  const [isAlertDetailsOpen, setIsAlertDetailsOpen] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  const { mapInitialized, mapConfig, setMapConfig, refreshMap, isMapLoaded, updateMarkers } = useTransportMap(mapRef, mockVehicleLocations);

  useEffect(() => {
    if (isMapLoaded) {
      updateMarkers(vehicleLocations);
    }
  }, [isMapLoaded, vehicleLocations, updateMarkers]);

  const filteredVehicles = mockVehicleLocations.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = alerts.filter(alert => 
    alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "en service":
        return <Badge className="bg-green-500">En service</Badge>;
      case "arrêté":
        return <Badge className="bg-yellow-500">Arrêté</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderAlertBadge = (type: string, status: string) => {
    let bgColor = "bg-red-500";
    
    if (status === 'resolved') {
      bgColor = "bg-gray-500";
    }
    
    return <Badge className={bgColor}>{type}</Badge>;
  };

  const handleMapProviderChange = (value: 'osm' | 'osm-france' | 'carto') => {
    setMapConfig({
      ...mapConfig,
      tileProvider: value
    });
    refreshMap();
  };

  const handleZoomChange = (value: number[]) => {
    setMapConfig({
      ...mapConfig,
      zoom: value[0]
    });
  };

  const handleShowLabelsChange = (checked: boolean) => {
    setMapConfig({
      ...mapConfig,
      showLabels: checked
    });
    refreshMap();
  };
  
  const handleVehicleDetails = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDetailsOpen(true);
  };
  
  const handleAlertDetails = (alert: any) => {
    setSelectedAlert(alert);
    setIsAlertDetailsOpen(true);
  };
  
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' } 
          : alert
      )
    );
    toast.success("Alerte résolue avec succès");
  };
  
  const handleConfigureSave = (data: any) => {
    console.log("Configuration des alertes sauvegardée:", data);
    toast.success("Configuration des alertes sauvegardée");
  };
  
  const handleApplyRoute = (routeId: string) => {
    setRoutes(prev => 
      prev.map(route => 
        route.id === routeId 
          ? { ...route, applied: true } 
          : route
      )
    );
    toast.success("Optimisation de l'itinéraire appliquée");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Géolocalisation des Véhicules</h2>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un véhicule par nom ou plaque d'immatriculation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Carte en temps réel</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Alertes</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>Optimisation des trajets</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  <span>Suivi en Temps Réel</span>
                </CardTitle>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>Configuration de la carte</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Configuration de la carte</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tileProvider">Fournisseur de carte</Label>
                        <Select 
                          value={mapConfig.tileProvider} 
                          onValueChange={(value: any) => handleMapProviderChange(value)}
                        >
                          <SelectTrigger id="tileProvider">
                            <SelectValue placeholder="Choisir un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="osm-france">OpenStreetMap France</SelectItem>
                            <SelectItem value="osm">OpenStreetMap Standard</SelectItem>
                            <SelectItem value="carto">CartoDB Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="zoom">Niveau de zoom</Label>
                          <span className="text-sm text-muted-foreground">{mapConfig.zoom}</span>
                        </div>
                        <Slider 
                          id="zoom"
                          min={1} 
                          max={18} 
                          step={1}
                          value={[mapConfig.zoom]}
                          onValueChange={handleZoomChange}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="showLabels">Afficher les informations détaillées</Label>
                        <Switch
                          id="showLabels"
                          checked={mapConfig.showLabels}
                          onCheckedChange={handleShowLabelsChange}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button onClick={refreshMap} size="sm">
                          Appliquer
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full relative">
                <div 
                  id="map"
                  ref={mapRef} 
                  className="h-[600px] w-full bg-gray-100 rounded-md mb-6 overflow-hidden"
                  style={{ position: 'relative', zIndex: 0 }}
                >
                  {!mapInitialized && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          Chargement de la carte...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Localisation des véhicules</h3>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Changer de vue</span>
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {filteredVehicles.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucun véhicule trouvé
                    </div>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.licensePlate} • Dernière mise à jour: {new Date(vehicle.location?.lastUpdate || "").toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {vehicle.location?.speed ? (
                            <span className="text-sm font-medium">{vehicle.location.speed} km/h</span>
                          ) : null}
                          {renderStatusBadge(vehicle.location?.status || "")}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVehicleDetails(vehicle)}
                          >
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertes et Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 border-orange-300 bg-orange-50 text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration des alertes</AlertTitle>
                <AlertDescription>
                  Vous pouvez configurer les règles d'alerte pour chaque véhicule dans les paramètres. 
                  Recevez des alertes pour excès de vitesse, utilisation non autorisée, et sortie de zone.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Alertes récentes</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => setIsAlertConfigOpen(true)}
                  >
                    <Bell className="h-4 w-4" />
                    Configurer
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {filteredAlerts.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune alerte trouvée
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {renderAlertBadge(alert.type, alert.status)}
                            {alert.vehicleName} ({alert.licensePlate})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {alert.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={alert.status === 'resolved'}
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            {alert.status === 'resolved' ? 'Résolu' : 'Résoudre'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAlertDetails(alert)}
                          >
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                <span>Optimisation des Trajets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 pt-1">
                    <Navigation className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Économies grâce à l'optimisation</h4>
                    <p className="text-sm text-green-700 mt-1">
                      L'optimisation des itinéraires a permis d'économiser environ 120 litres de carburant et 45 heures de trajet ce mois-ci.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Suggestions d'optimisation</h3>
                <div className="border rounded-md divide-y">
                  {routes.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune optimisation disponible
                    </div>
                  ) : (
                    routes.map((route) => (
                      <div key={route.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{route.vehicleName}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Itinéraire actuel: {route.currentRoute}
                            </div>
                            <div className="text-sm mt-2 flex items-center gap-1">
                              <span className="text-green-600 font-medium">Suggestion:</span>
                              <span>{route.optimizedRoute}</span>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Économie: {route.savingsMinutes} min • {route.savingsKm} km
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApplyRoute(route.id)}
                            disabled={route.applied}
                          >
                            {route.applied ? 'Appliqué' : 'Appliquer'}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <VehicleDetailsDialog 
        open={isVehicleDetailsOpen} 
        onOpenChange={setIsVehicleDetailsOpen} 
        vehicle={selectedVehicle} 
      />
      
      <AlertConfigDialog 
        open={isAlertConfigOpen} 
        onOpenChange={setIsAlertConfigOpen} 
        onSave={handleConfigureSave} 
      />
      
      <AlertDetailsDialog 
        open={isAlertDetailsOpen} 
        onOpenChange={setIsAlertDetailsOpen} 
        alert={selectedAlert}
        onResolve={handleResolveAlert}
      />
    </div>
  );
};

export default TransportGeolocation;
