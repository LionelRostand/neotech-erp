
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  Clock,
  CheckCircle2, 
  AlertTriangle,
  FileExcel,
  FilePdf
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useAlertsData } from '@/hooks/useAlertsData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateAlertDialog from './alerts/CreateAlertDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AlertsFilter from './alerts/AlertsFilter';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';
import { Alert } from '@/hooks/useAlertsData';

const EmployeesAlerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('actives');
  const { alerts, stats, isLoading, error } = useAlertsData();
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<{
    type: string | null;
    severity: string | null;
    status: string | null;
    employee: string | null;
  }>({
    type: null,
    severity: null,
    status: null,
    employee: null,
  });

  const handleResolveAlert = (id: string) => {
    // Dans une application réelle, nous mettrions à jour Firebase ici
    toast({
      title: "Alerte résolue",
      description: `Alerte #${id} marquée comme résolue`
    });
  };

  const handleExportData = (format: 'excel' | 'pdf') => {
    const dataToExport = filteredAlerts.map(alert => ({
      ID: alert.id,
      Titre: alert.title,
      Type: alert.type,
      Priorité: alert.severity,
      'Date création': alert.createdDate,
      Statut: alert.status,
      Employé: alert.employeeName || 'Non assigné',
      'Assigné à': alert.assignedToName || 'Non assigné',
      Description: alert.description || ''
    }));

    if (format === 'excel') {
      const success = exportToExcel(dataToExport, 'Alertes', 'alertes_rh');
      if (success) {
        toast({
          title: "Export réussi",
          description: "Les données ont été exportées avec succès au format Excel"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur est survenue lors de l'export",
          variant: "destructive"
        });
      }
    } else {
      const success = exportToPdf(dataToExport, 'Alertes RH', 'alertes_rh');
      if (success) {
        toast({
          title: "Export réussi",
          description: "Les données ont été exportées avec succès au format PDF"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur est survenue lors de l'export",
          variant: "destructive"
        });
      }
    }
  };

  // Apply filters to alerts
  const applyFilters = (alerts: Alert[]) => {
    return alerts.filter(alert => {
      // Type filter
      if (filterCriteria.type && alert.type !== filterCriteria.type) {
        return false;
      }
      
      // Severity filter
      if (filterCriteria.severity && alert.severity !== filterCriteria.severity) {
        return false;
      }
      
      // Status filter
      if (filterCriteria.status && alert.status !== filterCriteria.status) {
        return false;
      }
      
      // Employee filter
      if (filterCriteria.employee && alert.employeeId !== filterCriteria.employee) {
        return false;
      }
      
      return true;
    });
  };

  // First filter by tab
  const tabFilteredAlerts = activeTab === 'toutes' 
    ? alerts 
    : activeTab === 'actives'
    ? alerts.filter(alert => alert.status === 'Active')
    : activeTab === 'attente'
    ? alerts.filter(alert => alert.status === 'En attente')
    : alerts.filter(alert => alert.status === 'Résolue');
  
  // Then apply additional filters
  const filteredAlerts = applyFilters(tabFilteredAlerts);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-amber-100 text-amber-800';
      case 'Basse':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Contrat':
        return <FileText className="h-4 w-4" />;
      case 'Absence':
        return <Clock className="h-4 w-4" />;
      case 'Document':
        return <FileText className="h-4 w-4" />;
      case 'Congé':
        return <Clock className="h-4 w-4" />;
      case 'Évaluation':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des alertes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des alertes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Alertes</h2>
          <p className="text-gray-500">Suivi des alertes et notifications RH</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <AlertsFilter 
                filterCriteria={filterCriteria} 
                setFilterCriteria={setFilterCriteria} 
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">Format d'export</h4>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportData('excel')}
                    className="justify-start"
                  >
                    <FileExcel className="h-4 w-4 mr-2" />
                    Excel (.xlsx)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportData('pdf')}
                    className="justify-start"
                  >
                    <FilePdf className="h-4 w-4 mr-2" />
                    PDF (.pdf)
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle alerte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle alerte</DialogTitle>
              </DialogHeader>
              <CreateAlertDialog onClose={() => setIsCreateAlertOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Priorité haute</h3>
              <p className="text-2xl font-bold text-red-700">{stats.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Alertes actives</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.active}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Résolues</h3>
              <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="actives" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Actives
          </TabsTrigger>
          <TabsTrigger value="attente" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            En attente
          </TabsTrigger>
          <TabsTrigger value="resolues" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Résolues
          </TabsTrigger>
          <TabsTrigger value="toutes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Toutes
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Alerte</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Assigné à</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.title}</TableCell>
                          <TableCell>
                            {alert.employeeId ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={alert.employeePhoto} alt={alert.employeeName} />
                                  <AvatarFallback>{alert.employeeName?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <span>{alert.employeeName}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(alert.type)}
                              <span>{alert.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{alert.createdDate}</TableCell>
                          <TableCell>
                            <Badge className={getSeverityStyle(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{alert.assignedToName}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                alert.status === 'Active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : alert.status === 'En attente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                              }
                            >
                              {alert.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {alert.status !== 'Résolue' ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleResolveAlert(alert.id)}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Résoudre
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune alerte trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesAlerts;
