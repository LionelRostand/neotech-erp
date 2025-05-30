
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { jsPDF } from 'jspdf';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee
}) => {
  if (!selectedBadge) return null;
  
  const handleDownloadBadge = () => {
    // Create a new PDF document - using landscape format for badge display
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54] // ID card standard size (85mm x 54mm)
    });
    
    // Set background color for entire badge
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85, 54, 'F');
    
    // Add company header with status color
    let headerColor;
    if (selectedBadge.status === 'success') {
      headerColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      headerColor = [234, 179, 8];
    } else {
      headerColor = [239, 68, 68];
    }
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, 85, 12, 'F');
    
    // Company logo/name on left
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('STORM GROUP', 5, 7);
    
    // Company tagline on right
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Enterprise Solutions', 80, 7, { align: 'right' });
    
    // Add badge ID
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`ID: ${selectedBadge.id}`, 42.5, 18, { align: 'center' });
    
    // Add employee name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 25, { align: 'center' });
    
    // Add employee details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 31, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 36, { align: 'center' });
    
    // Add status
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let statusColor;
    if (selectedBadge.status === 'success') {
      statusColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      statusColor = [234, 179, 8];
    } else {
      statusColor = [239, 68, 68];
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Statut: ${selectedBadge.statusText}`, 42.5, 41, { align: 'center' });
    
    // Add date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Émis le: ${selectedBadge.date}`, 42.5, 46, { align: 'center' });
    
    // Add company footer
    doc.setFillColor(70, 70, 70);
    doc.rect(0, 50, 85, 4, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });
    
    // Add QR code placeholder in bottom left
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 36, 10, 10, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(6, 37, 8, 8, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(7, 38, 6, 6, 'F');

    // Save the PDF
    doc.save(`badge-${selectedBadge.id}.pdf`);
    
    toast.success("Badge téléchargé avec succès");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Badge</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-100 rounded-md p-6 mb-4">
            <div className={`h-2 w-full mb-3 rounded-t ${
              selectedBadge.status === 'success' ? 'bg-green-500' : 
              selectedBadge.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500">ID: {selectedBadge.id}</p>
              <h3 className="text-lg font-bold">{selectedBadge.employeeName}</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Département:</span> {selectedBadge.department || 'N/A'}</p>
              <p><span className="font-medium">Niveau d'accès:</span> {selectedBadge.accessLevel || 'Standard'}</p>
              <p><span className="font-medium">Statut:</span> 
                <span className={`ml-1 ${
                  selectedBadge.status === 'success' ? 'text-green-600' : 
                  selectedBadge.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {selectedBadge.statusText}
                </span>
              </p>
              <p><span className="font-medium">Date d'émission:</span> {selectedBadge.date}</p>
            </div>
            
            {selectedEmployee && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Informations supplémentaires</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                  <p><span className="font-medium">Poste:</span> {selectedEmployee.position}</p>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleDownloadBadge} 
            className="w-full" 
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger le badge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
