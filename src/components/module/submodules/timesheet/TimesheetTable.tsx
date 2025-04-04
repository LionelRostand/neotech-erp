
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  FileEdit, 
  ThumbsUp, 
  ThumbsDown 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';

interface TimesheetTableProps {
  data: TimeReport[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ 
  data, 
  onView, 
  onEdit, 
  onApprove, 
  onReject,
  isLoading
}) => {
  const getStatusBadge = (status: TimeReportStatus) => {
    switch (status) {
      case "En cours":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">En cours</Badge>;
      case "Soumis":
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Soumis</Badge>;
      case "Validé":
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Validé</Badge>;
      case "Rejeté":
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Période</TableHead>
            <TableHead className="hidden md:table-cell">Titre</TableHead>
            <TableHead className="text-center">Heures</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="hidden md:table-cell">Mise à jour</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Aucune feuille de temps trouvée.
              </TableCell>
            </TableRow>
          ) : (
            data.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={report.employeePhoto} />
                      <AvatarFallback>{report.employeeName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{report.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {report.startDate && new Date(report.startDate).toLocaleDateString('fr')} - {report.endDate && new Date(report.endDate).toLocaleDateString('fr')}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {report.title}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {report.totalHours}h
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(report.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {report.lastUpdateText || report.lastUpdated && new Date(report.lastUpdated).toLocaleDateString('fr')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(report.id)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                      )}
                      {(onEdit && report.status !== "Validé") && (
                        <DropdownMenuItem onClick={() => onEdit(report.id)} className="cursor-pointer">
                          <FileEdit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                      )}
                      {(onApprove && report.status === "Soumis") && (
                        <DropdownMenuItem onClick={() => onApprove(report.id)} className="cursor-pointer">
                          <ThumbsUp className="mr-2 h-4 w-4" /> Valider
                        </DropdownMenuItem>
                      )}
                      {(onReject && report.status === "Soumis") && (
                        <DropdownMenuItem onClick={() => onReject(report.id)} className="cursor-pointer">
                          <ThumbsDown className="mr-2 h-4 w-4" /> Rejeter
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimesheetTable;
