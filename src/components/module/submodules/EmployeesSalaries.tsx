import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  History, 
  FileEdit, 
  Download, 
  Search,
  Plus,
  FileText,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { employees } from '@/data/employees';

const MOCK_SALARIES = [
  { 
    id: 1, 
    name: 'John Doe', 
    position: 'Software Engineer', 
    salary: 75000, 
    paymentDate: '25/05/2023',
    department: 'Engineering',
    status: 'paid',
    leaves: { paid: 12, taken: 4, remaining: 8 },
    rtt: { allocated: 10, taken: 2, remaining: 8 },
    employeeId: "EMP001"
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    position: 'Project Manager', 
    salary: 90000, 
    paymentDate: '25/05/2023',
    department: 'Management',
    status: 'paid',
    leaves: { paid: 15, taken: 7, remaining: 8 },
    rtt: { allocated: 12, taken: 5, remaining: 7 },
    employeeId: "EMP002"
  },
  { 
    id: 3, 
    name: 'Emily Johnson', 
    position: 'Designer', 
    salary: 65000, 
    paymentDate: '25/05/2023',
    department: 'Design',
    status: 'paid',
    leaves: { paid: 10, taken: 3, remaining: 7 },
    rtt: { allocated: 8, taken: 3, remaining: 5 },
    employeeId: "EMP003"
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    position: 'Marketing Specialist', 
    salary: 68000, 
    paymentDate: '25/05/2023',
    department: 'Marketing',
    status: 'pending',
    leaves: { paid: 12, taken: 2, remaining: 10 },
    rtt: { allocated: 8, taken: 1, remaining: 7 },
    employeeId: ""
  },
  { 
    id: 5, 
    name: 'Sarah Wilson', 
    position: 'HR Manager', 
    salary: 82000, 
    paymentDate: '25/05/2023',
    department: 'Human Resources',
    status: 'paid',
    leaves: { paid: 15, taken: 10, remaining: 5 },
    rtt: { allocated: 10, taken: 6, remaining: 4 },
    employeeId: ""
  }
];

const MOCK_HISTORY = [
  { id: 1, employeeId: 1, date: '25/04/2023', amount: 74000, reason: 'Annual salary' },
  { id: 2, employeeId: 1, date: '25/03/2023', amount: 74000, reason: 'Annual salary' },
  { id: 3, employeeId: 1, date: '25/02/2023', amount: 74000, reason: 'Annual salary' },
  { id: 4, employeeId: 2, date: '25/04/2023', amount: 88000, reason: 'Annual salary' },
  { id: 5, employeeId: 2, date: '25/03/2023', amount: 88000, reason: 'Annual salary' },
  { id: 6, employeeId: 3, date: '25/04/2023', amount: 65000, reason: 'Annual salary' },
];

const COMPANY_INFO = {
  name: "STORM GROUP",
  tagline: "Enterprise Solutions",
  address: "123 Business Street, 75000 Paris",
  siret: "SIRET: 123 456 789 00012",
  phone: "+33 1 23 45 67 89",
  email: "contact@stormgroup.com",
  website: "www.stormgroup.com",
};

const EmployeesSalaries = () => {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewSalaryDialog, setShowNewSalaryDialog] = useState(false);
  const [filteredSalaries, setFilteredSalaries] = useState(MOCK_SALARIES);
  const [editForm, setEditForm] = useState({
    salary: '',
    position: '',
    department: '',
  });
  const [newSalaryForm, setNewSalaryForm] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    employeeId: '',
  });
  
  const getEmployeeDetails = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };
  
  React.useEffect(() => {
    const results = MOCK_SALARIES.filter(employee => 
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSalaries(results);
  }, [search]);
  
  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.salary.toString(),
      position: employee.position,
      department: employee.department,
    });
    setShowEditDialog(true);
  };
  
  const handleSaveChanges = () => {
    toast.success("Informations mises à jour avec succès");
    setShowEditDialog(false);
  };
  
  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDetailsDialog(true);
  };
  
  const handleViewHistory = (employee: any) => {
    setSelectedEmployee(employee);
    setShowHistoryDialog(true);
  };
  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaires");
    XLSX.writeFile(workbook, "salaires.xlsx");
    toast.success("Données exportées en Excel avec succès");
  };
  
  const handleCreateSalary = () => {
    const selectedEmployeeDetails = newSalaryForm.employeeId 
      ? employees.find(emp => emp.id === newSalaryForm.employeeId) 
      : null;
      
    const employeeName = selectedEmployeeDetails 
      ? `${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`
      : newSalaryForm.name;
      
    const employeePosition = selectedEmployeeDetails
      ? selectedEmployeeDetails.position
      : newSalaryForm.position;
      
    const employeeDepartment = selectedEmployeeDetails
      ? selectedEmployeeDetails.department
      : newSalaryForm.department;
    
    const newSalary = {
      id: MOCK_SALARIES.length + 1,
      name: employeeName,
      position: employeePosition,
      department: employeeDepartment,
      salary: parseFloat(newSalaryForm.salary),
      paymentDate: newSalaryForm.paymentDate,
      status: newSalaryForm.status,
      leaves: { paid: 12, taken: 0, remaining: 12 },
      rtt: { allocated: 10, taken: 0, remaining: 10 },
      employeeId: newSalaryForm.employeeId
    };
    
    setFilteredSalaries([newSalary, ...filteredSalaries]);
    toast.success("Nouvelle fiche de paie créée avec succès");
    setShowNewSalaryDialog(false);
    
    setNewSalaryForm({
      name: '',
      position: '',
      department: '',
      salary: '',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      employeeId: '',
    });
  };
  
  const handleEmployeeSelection = (employeeId: string) => {
    setNewSalaryForm({
      ...newSalaryForm,
      employeeId,
      name: '',  // Clear manual name since we're using dropdown selection
    });
  };
  
  const generatePayStubPDF = (employee: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    
    doc.setFillColor(220, 220, 220);
    doc.rect(20, 15, 25, 25, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(COMPANY_INFO.name, 32.5, 25, { align: "center" });
    doc.setFontSize(6);
    doc.text("LOGO", 32.5, 30, { align: "center" });
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text(COMPANY_INFO.name, 190, 20, { align: "right" });
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(COMPANY_INFO.tagline, 190, 27, { align: "right" });
    doc.text(COMPANY_INFO.address, 190, 34, { align: "right" });
    doc.text(COMPANY_INFO.siret, 190, 41, { align: "right" });
    doc.text(COMPANY_INFO.phone, 190, 48, { align: "right" });
    doc.text(COMPANY_INFO.email, 190, 55, { align: "right" });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 65, 190, 65);
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("BULLETIN DE PAIE", 105, 75, { align: "center" });
    doc.text(`${employee.paymentDate}`, 105, 85, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Informations Employé", 20, 100);
    
    doc.setFontSize(10);
    doc.text(`Nom: ${employee.name}`, 20, 110);
    doc.text(`Poste: ${employee.position}`, 20, 118);
    doc.text(`Département: ${employee.department}`, 20, 126);
    doc.text(`ID Employé: ${employee.id}`, 20, 134);
    
    const employeeDetails = employee.employeeId ? getEmployeeDetails(employee.employeeId) : null;
    if (employeeDetails) {
      doc.text(`Email: ${employeeDetails.email}`, 20, 142);
      doc.text(`Téléphone: ${employeeDetails.phone}`, 20, 150);
      doc.text(`Date d'embauche: ${employeeDetails.hireDate}`, 20, 158);
    }
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Détails de la Rémunération", 20, employeeDetails ? 170 : 150);
    
    doc.autoTable({
      startY: employeeDetails ? 175 : 155,
      head: [['Description', 'Montant']],
      body: [
        ['Salaire Brut Annuel', `${employee.salary.toLocaleString('fr-FR')} €`],
        ['Salaire Mensuel Brut', `${(employee.salary / 12).toLocaleString('fr-FR')} €`],
        ['Salaire Net Mensuel (Estimation)', `${((employee.salary / 12) * 0.75).toLocaleString('fr-FR')} €`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [80, 80, 80] },
      margin: { left: 20, right: 20 }
    });
    
    const finalY = (doc as any).autoTable.previous?.finalY || 200;
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Suivi des Congés et RTT", 20, finalY + 15);
    
    doc.autoTable({
      startY: finalY + 20,
      head: [['Type', 'Alloués', 'Pris', 'Restants']],
      body: [
        ['Congés Payés', `${employee.leaves.paid} jours`, `${employee.leaves.taken} jours`, `${employee.leaves.remaining} jours`],
        ['RTT', `${employee.rtt.allocated} jours`, `${employee.rtt.taken} jours`, `${employee.rtt.remaining} jours`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [80, 80, 80] },
      margin: { left: 20, right: 20 }
    });
    
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Ce document est confidentiel. Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: "center" });
    
    doc.save(`bulletin_paie_${employee.name.replace(/\s+/g, '_')}_${employee.paymentDate.replace(/\//g, '-')}.pdf`);
    toast.success("Bulletin de paie téléchargé avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Gestion des salaires</h2>
              <p className="text-muted-foreground">Gérez et suivez les salaires des employés</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Exporter Excel
              </Button>
              <Button onClick={() => setShowNewSalaryDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, poste, département..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Salaire Annuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalaries.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">#{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">{employee.salary.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>
                      <Badge 
                        variant={employee.status === 'paid' ? 'default' : 'outline'}
                        className={employee.status === 'paid' ? 'bg-green-500' : ''}
                      >
                        {employee.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(employee)}
                          title="Voir les détails"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewHistory(employee)}
                          title="Historique des salaires"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(employee)}
                          title="Modifier"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => generatePayStubPDF(employee)}
                          title="Télécharger bulletin de paie"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du salaire</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Employé</Label>
                  <p className="font-medium">{selectedEmployee.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">ID</Label>
                  <p className="font-medium">#{selectedEmployee.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Poste</Label>
                  <p className="font-medium">{selectedEmployee.position}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Département</Label>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Salaire Annuel</Label>
                  <p className="font-medium">{selectedEmployee.salary.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Salaire Mensuel</Label>
                  <p className="font-medium">{(selectedEmployee.salary / 12).toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Dernière paie</Label>
                  <p className="font-medium">{selectedEmployee.paymentDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Statut</Label>
                  <Badge 
                    variant={selectedEmployee.status === 'paid' ? 'default' : 'outline'}
                    className={selectedEmployee.status === 'paid' ? 'bg-green-500' : ''}
                  >
                    {selectedEmployee.status === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                </div>
              </div>
              
              {

