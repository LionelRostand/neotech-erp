
import React, { createContext, useContext, useState, useCallback } from 'react';
import { TransportVehicle, TransportDriver, VehicleMaintenanceSchedule, MapExtensionRequest } from '../../types';
// Import directly from mockData.ts
import { vehicles, maintenanceSchedules, extensionRequests, drivers } from '../mockData';

// Define the type for the context value
interface PlanningContextType {
  vehicles: TransportVehicle[];
  maintenanceSchedules: VehicleMaintenanceSchedule[];
  extensionRequests: MapExtensionRequest[];
  drivers: TransportDriver[];
  selectedVehicle: TransportVehicle | null;
  setSelectedVehicle: (vehicle: TransportVehicle | null) => void;
  selectedMaintenanceSchedule: VehicleMaintenanceSchedule | null;
  setSelectedMaintenanceSchedule: (schedule: VehicleMaintenanceSchedule | null) => void;
  selectedExtensionRequest: MapExtensionRequest | null;
  setSelectedExtensionRequest: (request: MapExtensionRequest | null) => void;
  showMaintenanceScheduleDialog: boolean;
  setShowMaintenanceScheduleDialog: (show: boolean) => void;
  showExtensionDetailsDialog: boolean;
  setShowExtensionDetailsDialog: (show: boolean) => void;
  refreshData: () => void;
  handleAddMaintenance: (vehicle: TransportVehicle) => void;
  handleViewMaintenanceDetails: (schedule: VehicleMaintenanceSchedule) => void;
  handleResolveExtension: (requestId: string, approved: boolean) => void;
  openMaintenanceScheduleDialog: (vehicle: TransportVehicle) => void;
  openExtensionDetailsDialog: (request: MapExtensionRequest) => void;
  filters: {
    status: string[];
    vehicleType: string[];
    priority: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string[];
    vehicleType: string[];
    priority: string[];
  }>>;
  availabilityDate: Date;
  setAvailabilityDate: React.Dispatch<React.SetStateAction<Date>>;
  filteredDrivers: TransportDriver[];
}

// Create the context
const PlanningContext = createContext<PlanningContextType | null>(null);

// Provider component
export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for data
  const [vehiclesData, setVehiclesData] = useState<TransportVehicle[]>(vehicles);
  const [maintenanceSchedulesData, setMaintenanceSchedulesData] = useState<VehicleMaintenanceSchedule[]>(
    maintenanceSchedules as unknown as VehicleMaintenanceSchedule[]
  );
  const [extensionRequestsData, setExtensionRequestsData] = useState<MapExtensionRequest[]>(
    extensionRequests as unknown as MapExtensionRequest[]
  );
  const [driversData, setDriversData] = useState<TransportDriver[]>(drivers);
  
  // State for selected items
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [selectedMaintenanceSchedule, setSelectedMaintenanceSchedule] = useState<VehicleMaintenanceSchedule | null>(null);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<MapExtensionRequest | null>(null);
  
  // Dialog visibility state
  const [showMaintenanceScheduleDialog, setShowMaintenanceScheduleDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: [],
    vehicleType: [],
    priority: [],
  });
  
  // Date for availability view
  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  // Get filtered drivers (those who are available)
  const filteredDrivers = driversData.filter(driver => 
    driver.available && driver.status !== "on_leave"
  );

  // Refresh data function
  const refreshData = useCallback(() => {
    // In a real app, this would fetch fresh data from an API
    setVehiclesData(vehicles);
    setMaintenanceSchedulesData(maintenanceSchedules as unknown as VehicleMaintenanceSchedule[]);
    setExtensionRequestsData(extensionRequests as unknown as MapExtensionRequest[]);
    setDriversData(drivers);
  }, []);
  
  // Function to add maintenance
  const handleAddMaintenance = useCallback((vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceScheduleDialog(true);
  }, []);
  
  // Function to view maintenance details
  const handleViewMaintenanceDetails = useCallback((schedule: VehicleMaintenanceSchedule) => {
    setSelectedMaintenanceSchedule(schedule);
    setShowMaintenanceScheduleDialog(true);
  }, []);
  
  // Function to resolve extension requests
  const handleResolveExtension = useCallback((requestId: string, approved: boolean) => {
    setExtensionRequestsData(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' } 
          : req
      )
    );
    setShowExtensionDetailsDialog(false);
  }, []);
  
  // Convenience function to open maintenance schedule dialog
  const openMaintenanceScheduleDialog = useCallback((vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedMaintenanceSchedule(null);
    setShowMaintenanceScheduleDialog(true);
  }, []);
  
  // Convenience function to open extension details dialog
  const openExtensionDetailsDialog = useCallback((request: MapExtensionRequest) => {
    setSelectedExtensionRequest(request);
    setShowExtensionDetailsDialog(true);
  }, []);

  const value = {
    vehicles: vehiclesData,
    maintenanceSchedules: maintenanceSchedulesData,
    extensionRequests: extensionRequestsData,
    drivers: driversData,
    selectedVehicle,
    setSelectedVehicle,
    selectedMaintenanceSchedule,
    setSelectedMaintenanceSchedule,
    selectedExtensionRequest,
    setSelectedExtensionRequest,
    showMaintenanceScheduleDialog,
    setShowMaintenanceScheduleDialog,
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog,
    refreshData,
    handleAddMaintenance,
    handleViewMaintenanceDetails,
    handleResolveExtension,
    openMaintenanceScheduleDialog,
    openExtensionDetailsDialog,
    filters,
    setFilters,
    availabilityDate,
    setAvailabilityDate,
    filteredDrivers,
  };

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>;
};

// Custom hook to use the planning context
export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
