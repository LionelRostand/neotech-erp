
import { jsPDF } from 'jspdf';

declare module 'jspdf-autotable' {
  export default function autoTable(doc: jsPDF, options: any): jsPDF;
}
