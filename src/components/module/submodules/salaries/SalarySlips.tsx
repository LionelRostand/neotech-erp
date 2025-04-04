import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataTable from '@/components/DataTable'; // Fixed import to use default import
import { Column } from '@/components/DataTable'; // This should work if Column is exported from DataTable
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import { Download, Filter, Plus, Search } from 'lucide-react';
import PaySlipGenerator from './PaySlipGenerator';
import PayslipViewer from './components/PayslipViewer';
import { PaySlip } from './types/payslip';
import PayslipFilterDialog from './components/PayslipFilterDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Employee } from '@/types/employee';
import { Company } from '../companies/types';

interface SalarySlipsProps {
  employees?: Employee[];
  companies?: Company[];
}

const SalarySlips: React.FC<SalarySlipsProps> = ({ employees, companies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { salarySlips, stats, isLoading, error } = useSalarySlipsData();

  const filteredSalarySlips = React.useMemo(() => {
    let filtered = salarySlips || [];

    if (searchQuery) {
      filtered = filtered.filter(slip =>
        slip.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slip.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slip.year.toString().includes(searchQuery)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(slip => slip.status === statusFilter);
    }

    return filtered;
  }, [salarySlips, searchQuery, statusFilter]);

  const salarySlipsColumns: Column[] = React.useMemo(
    () => [
      {
        key: 'employeeName',
        header: 'Employé',
        cell: ({ row }) => row.original.employeeName,
      },
      {
        key: 'month',
        header: 'Mois',
        cell: ({ row }) => row.original.month,
      },
      {
        key: 'year',
        header: 'Année',
        cell: ({ row }) => row.original.year,
      },
      {
        key: 'date',
        header: 'Date de paiement',
        cell: ({ row }) => row.original.date,
      },
      {
        key: 'netAmount',
        header: 'Montant net',
        cell: ({ row }) => `${row.original.netAmount} ${row.original.currency}`,
      },
      {
        key: 'status',
        header: 'Statut',
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.status === 'Généré'
                ? 'text-gray-500 border-gray-300'
                : row.original.status === 'Envoyé'
                ? 'text-blue-500 border-blue-300'
                : 'text-green-500 border-green-300'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
    ],
    []
  );

  const handleFilterStatusChange = (status: string | null) => {
    setStatusFilter(status);
    setIsFilterDialogOpen(false);
  };

  const handleRowClick = (payslip: PaySlip) => {
    setSelectedPayslip(payslip);
    setIsViewerOpen(true);
  };

  const handleDownloadPdf = async (payslip: PaySlip) => {
    if (!payslip) return;

    const doc = new jsPDF();

    // Titre du document
    doc.text(`Fiche de paie - ${payslip.employeeName}`, 10, 10);

    // Informations de l'employé et de l'employeur
    doc.text(`Employé: ${payslip.employeeName}`, 10, 20);
    doc.text(`Période: ${payslip.month} ${payslip.year}`, 10, 30);

    // Préparation des données pour le tableau
    const tableColumn = ["Description", "Montant"];
    const tableRows = payslip.details.map(detail => [detail.label, detail.amount.toString()]);

    // Ajout du tableau au document
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    // Enregistrement du PDF
    doc.save(`fiche-de-paie-${payslip.employeeName}-${payslip.month}-${payslip.year}.pdf`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fiches de paie</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Générées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.generated}</div>
                  <p className="text-sm text-gray-500">Fiches de paie générées ce mois-ci</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Envoyées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.sent}</div>
                  <p className="text-sm text-gray-500">Fiches de paie envoyées aux employés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.validated}</div>
                  <p className="text-sm text-gray-500">Fiches de paie validées par la direction</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <Input
                type="search"
                placeholder="Rechercher un employé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="space-x-2">
                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <PayslipFilterDialog
                      onFilter={handleFilterStatusChange}
                      onClose={() => setIsFilterDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Générer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <PaySlipGenerator employees={employees} companies={companies} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <DataTable
              title="Liste des fiches de paie"
              columns={salarySlipsColumns}
              data={filteredSalarySlips}
              onRowClick={handleRowClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent>
          {selectedPayslip && <PayslipViewer payslip={selectedPayslip} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SalarySlips;
