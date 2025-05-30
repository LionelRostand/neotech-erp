import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable';
import { useSalarySlipsData, SalarySlip } from '@/hooks/useSalarySlipsData';
import { Download, Plus, Search, Settings } from 'lucide-react';
import PaySlipGenerator from './PaySlipGenerator';
import PayslipViewer from './components/PayslipViewer';
import { PaySlip } from '@/types/payslip';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Employee } from '@/types/employee';
import { Company } from '../companies/types';
import PayslipConfiguration from './components/PayslipConfiguration';
import PayslipOperations from './components/PayslipOperations';
import { PayslipFiltersOptions } from './components/PayslipFilters';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface SalarySlipsProps {
  employees?: Employee[];
  companies?: Company[];
}

const SalarySlips: React.FC<SalarySlipsProps> = ({ employees = [], companies = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PayslipFiltersOptions>({});
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { salarySlips, stats, isLoading, error } = useSalarySlipsData();
  const { employees: hrEmployees, companies: hrCompanies } = useHrModuleData();
  
  const employeesToUse = employees.length > 0 ? employees : hrEmployees;
  const companiesToUse = companies.length > 0 ? companies : hrCompanies;

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

    if (filters.status) {
      filtered = filtered.filter(slip => slip.status === filters.status);
    }
    
    if (filters.month) {
      filtered = filtered.filter(slip => slip.month === filters.month);
    }
    
    if (filters.year) {
      filtered = filtered.filter(slip => slip.year === filters.year);
    }
    
    if (filters.employeeId) {
      filtered = filtered.filter(slip => slip.employeeId === filters.employeeId);
    }
    
    if (filters.department) {
      filtered = filtered.filter(slip => slip.department === filters.department);
    }

    return filtered;
  }, [salarySlips, searchQuery, filters]);

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

  const convertToPaySlip = (slip: SalarySlip): PaySlip => {
    return {
      id: slip.id,
      employee: {
        firstName: slip.employeeName?.split(' ')[0] || '',
        lastName: slip.employeeName?.split(' ')[1] || '',
        employeeId: slip.employeeId,
        role: 'Employé',
        socialSecurityNumber: '1 99 99 99 999 999 99',
        startDate: new Date().toISOString(),
      },
      period: `${slip.month} ${slip.year}`,
      details: [],
      grossSalary: slip.grossAmount,
      totalDeductions: slip.grossAmount - slip.netAmount,
      netSalary: slip.netAmount,
      hoursWorked: 35,
      paymentDate: slip.date,
      employerName: 'Entreprise',
      employerAddress: 'Adresse de l\'entreprise',
      employerSiret: '123 456 789 00000',
      status: slip.status,
      date: slip.date,
      employeeId: slip.employeeId,
      employeeName: slip.employeeName,
    };
  };

  const handleRowClick = (salarySlip: SalarySlip) => {
    const payslip = convertToPaySlip(salarySlip);
    setSelectedPayslip(payslip);
    setIsViewerOpen(true);
  };

  const handleDownloadPdf = async (payslip: PaySlip) => {
    if (!payslip) return;

    const doc = new jsPDF();

    doc.text(`Fiche de paie - ${payslip.employeeName}`, 10, 10);

    doc.text(`Employé: ${payslip.employeeName}`, 10, 20);
    doc.text(`Période: ${payslip.period}`, 10, 30);

    const tableColumn = ["Description", "Montant"];
    const tableRows = payslip.details.map(detail => [detail.label, detail.amount.toString()]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save(`fiche-de-paie-${payslip.employeeName}-${payslip.period.replace(' ', '-')}.pdf`);
  };

  const handleApplyFilters = (newFilters: PayslipFiltersOptions) => {
    setFilters(newFilters);
  };

  const handleExportData = () => {
    console.log("Exporting data...");
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
            <TabsTrigger value="config">Configuration</TabsTrigger>
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
            <div className="space-y-4">
              <div className="flex items-center relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un employé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <PayslipOperations 
                employees={employeesToUse}
                companies={companiesToUse}
                onFilter={handleApplyFilters}
                currentFilters={filters}
                onOpenGenerator={() => setIsGeneratorOpen(true)}
                onOpenConfiguration={() => setIsConfigOpen(true)}
                onExportData={handleExportData}
              />
            </div>
            
            <DataTable
              title="Liste des fiches de paie"
              columns={salarySlipsColumns}
              data={filteredSalarySlips}
              onRowClick={handleRowClick}
            />
          </TabsContent>
          <TabsContent value="config" className="space-y-4">
            <PayslipConfiguration />
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent>
          {selectedPayslip && <PayslipViewer payslip={selectedPayslip} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-4xl">
          <PayslipConfiguration />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent>
          <PaySlipGenerator employees={employeesToUse} companies={companiesToUse} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SalarySlips;
