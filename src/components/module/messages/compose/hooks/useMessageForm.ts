
import { useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Contact, MessageFormData, MessagePriority, MessageCategory, MessageStatus } from '../../types/message-types';
import { Timestamp } from 'firebase/firestore';

export const useMessageForm = () => {
  const messageCollection = useFirestore(COLLECTIONS.MESSAGES.INBOX);
  const scheduledCollection = useFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [category, setCategory] = useState<MessageCategory | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContacts(prev => [...prev, contact]);
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
  };

  const handleSendMessage = async () => {
    // Validation
    if (selectedContacts.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un destinataire."
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un objet pour le message."
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le contenu du message ne peut pas être vide."
      });
      return;
    }

    if (isScheduled && !scheduledDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date d'envoi programmé."
      });
      return;
    }

    setIsSending(true);

    try {
      const now = Timestamp.now();
      const messageData = {
        subject,
        content,
        sender: 'current-user-id', // ID de l'utilisateur connecté
        recipients: selectedContacts.map(c => c.id),
        status: isScheduled ? 'scheduled' as MessageStatus : 'unread' as MessageStatus,
        priority,
        category,
        tags,
        hasAttachments: attachments.length > 0,
        isArchived: false,
        isScheduled,
        scheduledAt: isScheduled && scheduledDate ? Timestamp.fromDate(scheduledDate) : undefined,
        createdAt: now,
        updatedAt: now
      };

      // Collection en fonction du type de message
      const collection = isScheduled ? scheduledCollection : messageCollection;
      
      // Simuler l'envoi
      setTimeout(async () => {
        await collection.add(messageData);
        
        toast({
          title: isScheduled ? "Message programmé" : "Message envoyé",
          description: isScheduled 
            ? `Le message sera envoyé le ${scheduledDate?.toLocaleDateString()}` 
            : "Votre message a été envoyé avec succès."
        });
        
        navigate(isScheduled ? '/modules/messages/scheduled' : '/modules/messages/inbox');
        setIsSending(false);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer."
      });
      setIsSending(false);
    }
  };

  return {
    selectedContacts,
    setSelectedContacts,
    subject,
    setSubject,
    content,
    setContent,
    priority,
    setPriority,
    category,
    setCategory,
    tags,
    currentTag,
    setCurrentTag,
    attachments,
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    isSending,
    handleSelectContact,
    handleRemoveContact,
    handleAddTag,
    handleRemoveTag,
    handleFileChange,
    handleRemoveFile,
    handleSendMessage
  };
};
