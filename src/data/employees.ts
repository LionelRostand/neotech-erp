
import { Employee } from '@/types/employee';

// Données simulées d'employés
export const employees: Employee[] = [
  {
    id: "EMP001",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "15 Rue des Lilas, 75011 Paris",
    department: "Marketing",
    position: "Chef de Projet Digital",
    hireDate: "15/03/2021",
    status: "Actif",
    contract: "CDI",
    manager: "Sophie Martin",
    education: [
      { degree: "Master Marketing Digital", school: "HEC Paris", year: "2018" },
      { degree: "Licence Communication", school: "Université Paris-Sorbonne", year: "2016" }
    ],
    skills: ["Marketing digital", "Gestion de projet", "SEO/SEA", "Adobe Creative Suite", "Analyse de données"],
    documents: [
      { name: "Contrat de travail", date: "15/03/2021", type: "Contrat" },
      { name: "Avenant salaire", date: "10/06/2022", type: "Avenant" },
      { name: "Attestation formation", date: "22/09/2022", type: "Formation" }
    ],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    }
  },
  {
    id: "EMP002",
    firstName: "Lionel",
    lastName: "Djossa",
    email: "lionel.djossa@example.com",
    phone: "+33 6 98 76 54 32",
    address: "8 Avenue Victor Hugo, 75016 Paris",
    department: "Direction",
    position: "PDG",
    hireDate: "27/03/2025",
    status: "Actif",
    contract: "CDI",
    manager: "",
    education: [
      { degree: "MBA Management", school: "INSEAD", year: "2015" },
      { degree: "Master Finance", school: "HEC Paris", year: "2013" }
    ],
    skills: ["Leadership", "Stratégie", "Finance", "Management", "Négociation"],
    documents: [
      { name: "Contrat de travail", date: "27/03/2025", type: "Contrat" }
    ],
    workSchedule: {
      monday: "08:30 - 19:00",
      tuesday: "08:30 - 19:00",
      wednesday: "08:30 - 19:00",
      thursday: "08:30 - 19:00",
      friday: "08:30 - 18:00",
    }
  },
  {
    id: "EMP003",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "+33 6 45 67 89 01",
    address: "25 Rue du Commerce, 75015 Paris",
    department: "Marketing",
    position: "Directrice Marketing",
    hireDate: "05/01/2020",
    status: "Actif",
    contract: "CDI",
    manager: "Lionel Djossa",
    education: [
      { degree: "Master Marketing", school: "ESSEC", year: "2012" }
    ],
    skills: ["Stratégie marketing", "Management d'équipe", "Budgétisation", "Communication"],
    documents: [
      { name: "Contrat de travail", date: "05/01/2020", type: "Contrat" },
      { name: "Avenant promotion", date: "15/12/2021", type: "Avenant" }
    ],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    }
  }
];
