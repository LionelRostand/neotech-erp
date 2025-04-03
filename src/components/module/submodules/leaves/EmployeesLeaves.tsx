
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  SunMedium, 
  Calendar, 
  Clock, 
  ListFilter, 
  Plus,
  Download,
  FileText
} from 'lucide-react';
import { LeaveRequestsList } from './LeaveRequestsList';
import { LeaveBalanceCards } from './LeaveBalanceCards';
import { toast } from 'sonner';
import { useLeaveData } from '@/hooks/useLeaveData';

const EmployeesLeaves: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demandes');
  const { leaves, stats, isLoading, error } = useLeaveData();

  const handleApproveLeave = (id: string) => {
    // Dans une application réelle, nous mettrions à jour Firebase ici
    toast.success(`Demande de congé #${id} approuvée`);
  };

  const handleRejectLeave = (id: string) => {
    // Dans une application réelle, nous mettrions à jour Firebase ici
    toast.success(`Demande de congé #${id} refusée`);
  };

  const handleExportData = () => {
    toast.success("Export des données de congés démarré");
    // Logique d'export à implémenter
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des congés</h2>
          <p className="text-gray-500">Suivi et approbation des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">
                {isLoading ? '...' : stats.pending}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Approuvées</h3>
              <p className="text-2xl font-bold text-green-700">
                {isLoading ? '...' : stats.approved}
              </p>
            </div>
            <SunMedium className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusées</h3>
              <p className="text-2xl font-bold text-red-700">
                {isLoading ? '...' : stats.rejected}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">
                {isLoading ? '...' : stats.total}
              </p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="demandes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="soldes" className="flex items-center">
            <SunMedium className="h-4 w-4 mr-2" />
            Soldes
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Politiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demandes">
          <Card>
            <CardContent className="p-6">
              <LeaveRequestsList 
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Calendrier des congés (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soldes">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Soldes de congés par employé (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Politiques de congés (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesLeaves;
