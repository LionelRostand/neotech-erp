
import { useState, useEffect } from 'react';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { toast } from 'sonner';

export const useOpportunities = () => {
  // Reuse the mockOpportunities data that's already defined in the codebase
  const { mockOpportunities } = useOpportunitiesData();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call to fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOpportunities(mockOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Une erreur est survenue lors du chargement des opportunités');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Add a new opportunity
  const addOpportunity = async (data: OpportunityFormData): Promise<Opportunity> => {
    // Simulate API call to add an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert string values to numbers where needed
    const valueAsNumber = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
    const probabilityAsNumber = typeof data.probability === 'string' ? parseFloat(data.probability) : data.probability;
    const amountAsNumber = data.amount ? (typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount) : undefined;
    
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      ...data,
      value: valueAsNumber,
      probability: probabilityAsNumber,
      amount: amountAsNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOpportunities(prev => [newOpportunity, ...prev]);
    toast.success('Opportunité ajoutée avec succès');
    return newOpportunity;
  };

  // Update an existing opportunity
  const updateOpportunity = async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    // Simulate API call to update an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create updates object with type-safe properties
    const updates: Record<string, any> = {};
    
    // Copy all properties except for numeric ones that need conversion
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'value' && key !== 'probability' && key !== 'amount') {
        updates[key] = value;
      }
    });
    
    // Handle numeric properties separately with proper type conversion
    if (data.value !== undefined) {
      updates.value = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
    }
    
    if (data.probability !== undefined) {
      updates.probability = typeof data.probability === 'string' ? parseFloat(data.probability) : data.probability;
    }
    
    if (data.amount !== undefined && data.amount !== null) {
      updates.amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    }
    
    // Create a new array of opportunities with the updated one
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === id) {
        // Type cast to ensure we're returning an Opportunity
        return {
          ...opp,
          ...updates,
          updatedAt: new Date().toISOString(),
        } as Opportunity;
      }
      return opp;
    });
    
    setOpportunities(updatedOpportunities);
    const updatedOpportunity = updatedOpportunities.find(opp => opp.id === id);
    
    if (!updatedOpportunity) {
      throw new Error('Opportunity not found');
    }
    
    toast.success('Opportunité mise à jour avec succès');
    return updatedOpportunity;
  };

  // Delete an opportunity
  const deleteOpportunity = async (id: string): Promise<void> => {
    // Simulate API call to delete an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
    toast.success('Opportunité supprimée avec succès');
  };

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity
  };
};

// Helper function to provide mock data
const useOpportunitiesData = () => {
  // Mock data for opportunities
  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      name: 'Déploiement CRM',
      description: 'Mise en place d\'un CRM pour une entreprise de services',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'ABC Corporation',
      contactName: 'Jean Dupont',
      contactEmail: 'jean@abc-corp.fr',
      contactPhone: '01 23 45 67 89',
      amount: 15000,
      value: 15000,
      probability: 70,
      expectedCloseDate: '2025-05-15',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Refonte Site Web',
      description: 'Refonte complète du site web corporate',
      stage: OpportunityStage.DISCOVERY,
      clientName: 'Tech Solutions',
      contactName: 'Pierre Lefebvre',
      contactEmail: 'pierre@techsolutions.fr',
      contactPhone: '01 87 65 43 21',
      amount: 8500,
      value: 8500,
      probability: 50,
      expectedCloseDate: '2025-06-10',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Formation Excel Avancé',
      description: 'Formation pour 15 employés sur Excel avancé',
      stage: OpportunityStage.CLOSED_WON,
      clientName: 'Comptabilité Plus',
      contactName: 'Marie Lambert',
      contactEmail: 'marie@comptaplus.fr',
      contactPhone: '01 45 67 89 12',
      amount: 3000,
      value: 3000,
      probability: 100,
      expectedCloseDate: '2025-04-30',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Audit Sécurité',
      description: 'Audit complet de la sécurité informatique',
      stage: OpportunityStage.NEGOTIATION,
      clientName: 'Banque Régionale',
      contactName: 'Thomas Richard',
      contactEmail: 'thomas@banqueregionale.fr',
      contactPhone: '01 23 56 78 90',
      amount: 12000,
      value: 12000,
      probability: 80,
      expectedCloseDate: '2025-05-20',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Maintenance Annuelle',
      description: 'Contrat de maintenance annuelle pour le parc informatique',
      stage: OpportunityStage.LEAD,
      clientName: 'Industrie Moderne',
      contactName: 'Philippe Garnier',
      contactEmail: 'philippe@industriemoderne.fr',
      contactPhone: '01 98 76 54 32',
      amount: 9500,
      value: 9500,
      probability: 30,
      expectedCloseDate: '2025-07-15',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Développement Application Mobile',
      description: 'Développement d\'une application mobile de gestion clients',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'MobileFirst',
      contactName: 'Claire Dubois',
      contactEmail: 'claire@mobilefirst.fr',
      contactPhone: '01 34 56 78 90',
      amount: 25000,
      value: 25000,
      probability: 60,
      expectedCloseDate: '2025-06-30',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return { mockOpportunities };
};
