
import { Note } from './base-types';

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseType?: string;
  address?: string;
  hireDate?: string;
  preferredVehicleType?: string;
  available: boolean;
  onLeave?: boolean;
  rating: number;
  experience: number;
  photo: string;
  skills?: string[];
  preferredVehicleTypes?: string[];
  notes?: string;
  // Additional properties needed by components
  status?: "active" | "on-leave" | "inactive" | "driving" | "off-duty" | "vacation" | "sick";
  performance?: {
    onTimeRate: number;
    customerSatisfaction: number;
    safetyScore: number;
    [key: string]: number;
  };
}

export interface DriverNote extends Note {
  driverId: string;
}
