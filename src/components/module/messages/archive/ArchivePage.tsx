
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../types/message-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, ArchiveRestore } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ArchivedMessagesList from './ArchivedMessagesList';
import { Timestamp } from 'firebase/firestore';

const ArchivePage: React.FC = () => {
  const { getAll } = useFirestore(COLLECTIONS.MESSAGES.ARCHIVED);
  const contactsCollection = useFirestore(COLLECTIONS.CONTACTS);
  const [archivedMessages, setArchivedMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState<Record<string, boolean>>({});
  const [dataFetched, setDataFetched] = useState(false);
  const { toast } = useToast();

  // Récupérer les messages archivés et les contacts
  useEffect(() => {
    // Éviter la récupération répétée des données
    if (dataFetched) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les contacts
        const contactsData = await contactsCollection.getAll();
        const contactsMap: Record<string, Contact> = {};
        contactsData.forEach(contact => {
          contactsMap[contact.id] = contact as Contact;
        });
        setContacts(contactsMap);
        
        // Récupérer les messages archivés
        const messagesData = await getAll();
        console.log("Messages archivés récupérés:", messagesData);
        
        if (!messagesData || messagesData.length === 0) {
          // Créer des données fictives pour la démo
          const mockMessages: Message[] = Array.from({ length: 10 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i + 5) % 30); // Messages plus anciens
            
            return {
              id: `mock-archived-${i+1}`,
              subject: [
                'Ancienne demande de devis',
                'Réunion annulée du 15/05',
                'Documentation technique v1.0',
                'Ancien projet - Suivi',
                'Notes de réunion - Q1 2023'
              ][i % 5],
              content: `<p>Bonjour,</p><p>Ceci est un message archivé. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Cordialement,<br />L'équipe</p>`,
              sender: Object.keys(contactsMap)[i % Object.keys(contactsMap).length] || 'unknown-sender',
              recipients: ['current-user-id'],
              status: 'read' as any,
              priority: ['normal', 'low'][i % 2] as any,
              category: ['general', 'technical', 'administrative'][i % 3] as any,
              tags: i % 3 === 0 ? ['archive', 'historique'] : i % 2 === 0 ? ['ancien'] : [],
              hasAttachments: i % 3 === 0,
              isArchived: true,
              createdAt: Timestamp.fromDate(date),
              updatedAt: Timestamp.fromDate(date),
            };
          });
          
          console.log("Utilisation de messages archivés fictifs:", mockMessages);
          setArchivedMessages(mockMessages);
          setFilteredMessages(mockMessages);
        } else {
          console.log("Nombre de messages archivés trouvés:", messagesData.length);
          setArchivedMessages(messagesData as Message[]);
          setFilteredMessages(messagesData as Message[]);
        }
        
        setDataFetched(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les messages archivés."
        });
        
        // En cas d'erreur, générer des données fictives pour la démo
        const mockMessages: Message[] = Array.from({ length: 5 }, (_, i) => ({
          id: `error-mock-${i+1}`,
          subject: `Message de test ${i+1}`,
          content: "<p>Message de test généré après une erreur</p>",
          sender: "unknown",
          recipients: ["current-user"],
          status: "read" as any,
          priority: "normal" as any,
          category: "general" as any,
          tags: [],
          hasAttachments: false,
          isArchived: true,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        }));
        
        setArchivedMessages(mockMessages);
        setFilteredMessages(mockMessages);
        
        setDataFetched(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAll, contactsCollection, toast, dataFetched]);

  // Filtrer les messages selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = archivedMessages.filter(message => {
        const senderName = contacts[message.sender] ? 
          `${contacts[message.sender].firstName} ${contacts[message.sender].lastName}`.toLowerCase() : '';
        const senderEmail = contacts[message.sender]?.email?.toLowerCase() || '';
        const messageSubject = message.subject?.toLowerCase() || '';
        const messageContent = message.content?.toLowerCase() || '';
        
        return messageSubject.includes(term) ||
          senderName.includes(term) ||
          senderEmail.includes(term) ||
          messageContent.includes(term);
      });
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(archivedMessages);
    }
  }, [archivedMessages, searchTerm, contacts]);

  const handleRestoreMessage = (messageId: string) => {
    console.log("Tentative de restauration du message:", messageId);
    setIsRestoring(prev => ({ ...prev, [messageId]: true }));
    
    // Simuler la restauration
    setTimeout(() => {
      // Supprimer de la liste
      setArchivedMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      toast({
        title: "Message restauré",
        description: "Le message a été déplacé vers la boîte de réception."
      });
      
      setIsRestoring(prev => ({ ...prev, [messageId]: false }));
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Archives</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les archives..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Actualiser</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md h-[calc(100vh-250px)] min-h-[400px] overflow-hidden">
            <ArchivedMessagesList
              messages={filteredMessages}
              contacts={contacts}
              onRestoreMessage={handleRestoreMessage}
              isLoading={isLoading}
              isRestoring={isRestoring}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div>
              {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} archivé{filteredMessages.length !== 1 ? 's' : ''}
            </div>
            
            <div className="flex items-center">
              <ArchiveRestore className="h-4 w-4 mr-2" />
              <span>Les messages sont automatiquement supprimés après 6 mois</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
