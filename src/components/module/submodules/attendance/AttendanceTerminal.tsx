
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { EmployeeAttendance } from '@/types/attendance';

interface AttendanceTerminalProps {
  onCheckIn: (attendance: EmployeeAttendance) => void;
  onCheckOut: (employeeId: string, departureTime: string) => void;
  attendances: EmployeeAttendance[];
}

const AttendanceTerminal: React.FC<AttendanceTerminalProps> = ({ 
  onCheckIn, 
  onCheckOut,
  attendances 
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Mettre à jour l'heure et la date actuelle
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Rechercher un employé par ID
  const findEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  // Vérifier si l'employé est déjà présent aujourd'hui
  const isEmployeeCheckedInToday = (id: string) => {
    const today = new Date().toLocaleDateString('fr-FR');
    return attendances.some(
      attendance => attendance.employeeId === id && 
      attendance.date === today && 
      !attendance.departureTime
    );
  };

  // Gérer la validation d'entrée
  const handleCheckIn = () => {
    if (!employeeId) {
      toast.error("Veuillez entrer votre identifiant d'employé.");
      return;
    }
    
    const employee = findEmployee(employeeId);
    if (!employee) {
      toast.error("Employé non trouvé. Veuillez vérifier votre identifiant.");
      return;
    }
    
    if (isEmployeeCheckedInToday(employeeId)) {
      toast.error("Vous êtes déjà enregistré comme présent aujourd'hui.");
      return;
    }
    
    const attendanceRecord: EmployeeAttendance = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: new Date().toLocaleDateString('fr-FR'),
      arrivalTime: currentTime,
      departureTime: null,
      hoursWorked: '0h',
      status: 'Présent',
      validation: 'En attente'
    };
    
    onCheckIn(attendanceRecord);
    toast.success(`Bonjour ${employee.firstName} ${employee.lastName}, votre entrée a été enregistrée à ${currentTime}`);
    setEmployeeId('');
  };
  
  // Gérer la validation de sortie
  const handleCheckOut = () => {
    if (!employeeId) {
      toast.error("Veuillez entrer votre identifiant d'employé.");
      return;
    }
    
    const employee = findEmployee(employeeId);
    if (!employee) {
      toast.error("Employé non trouvé. Veuillez vérifier votre identifiant.");
      return;
    }
    
    if (!isEmployeeCheckedInToday(employeeId)) {
      toast.error("Vous n'avez pas encore enregistré votre entrée aujourd'hui.");
      return;
    }
    
    onCheckOut(employeeId, currentTime);
    toast.success(`Au revoir ${employee.firstName} ${employee.lastName}, votre sortie a été enregistrée à ${currentTime}`);
    setEmployeeId('');
  };
  
  return (
    <Card className="border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Borne de Présence</CardTitle>
            <CardDescription className="text-blue-100">Validation des entrées et sorties</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-lg">
              <Clock size={20} />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-sm text-blue-100">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="employee-id" className="text-sm font-medium">
              Identifiant employé
            </label>
            <Input
              id="employee-id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Saisissez votre ID employé (ex: EMP001)"
              className="text-lg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={handleCheckIn}
              className="flex items-center gap-2 py-6 bg-green-600 hover:bg-green-700"
            >
              <UserCheck size={24} />
              <span className="text-lg">Entrée</span>
            </Button>
            
            <Button 
              onClick={handleCheckOut}
              className="flex items-center gap-2 py-6 bg-red-600 hover:bg-red-700"
            >
              <UserX size={24} />
              <span className="text-lg">Sortie</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTerminal;
