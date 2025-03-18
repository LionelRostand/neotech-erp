
import { Employee } from '@/types/employee';

// Interface for Badge data
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

export interface BadgeStatsData {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

export const getInitials = (firstName: string, lastName: string) => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

export const generateBadgeNumber = (): string => {
  return `B-${Math.floor(2460 + Math.random() * 100)}`;
};
