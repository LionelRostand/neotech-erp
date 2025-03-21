
import React from 'react';
import { useParams } from 'react-router-dom';
import SalonDashboard from '../salon/dashboard/SalonDashboard';
import SalonClients from '../salon/clients/SalonClients';

// Placeholder components - these would be implemented in separate files
const SalonAppointments = () => <div>Gestion des Rendez-vous</div>;
const SalonStylists = () => <div>Gestion des Coiffeurs</div>;
const SalonServices = () => <div>Gestion des Services</div>;
const SalonProducts = () => <div>Gestion des Produits</div>;
const SalonBilling = () => <div>Gestion de la Facturation</div>;
const SalonLoyalty = () => <div>Programme de Fidélité</div>;
const SalonInventory = () => <div>Gestion des Stocks</div>;
const SalonReports = () => <div>Statistiques et Rapports</div>;
const SalonBooking = () => <div>Réservation Web & Mobile</div>;
const SalonSettings = () => <div>Paramètres</div>;

export const SalonRenderer = () => {
  const { submoduleId } = useParams<{ submoduleId: string }>();
  console.log('SalonRenderer from renderers: called with submoduleId:', submoduleId);
  
  switch (submoduleId) {
    case 'dashboard':
      return <SalonDashboard />;
    case 'clients':
      return <SalonClients />;
    case 'appointments':
      return <SalonAppointments />;
    case 'stylists':
      return <SalonStylists />;
    case 'services':
      return <SalonServices />;
    case 'products':
      return <SalonProducts />;
    case 'billing':
      return <SalonBilling />;
    case 'loyalty':
      return <SalonLoyalty />;
    case 'inventory':
      return <SalonInventory />;
    case 'reports':
      return <SalonReports />;
    case 'booking':
      return <SalonBooking />;
    case 'settings':
      return <SalonSettings />;
    default:
      return <SalonDashboard />;
  }
};
