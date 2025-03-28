
import { 
  DocumentData,
  addDoc
} from 'firebase/firestore';
import { getCollectionRef, formatDocumentWithTimestamps } from './common-utils';

// Add a new document to a collection
export const addDocument = async (collectionName: string, data: DocumentData) => {
  const collectionRef = getCollectionRef(collectionName);
  const formattedData = formatDocumentWithTimestamps(data);
  
  const docRef = await addDoc(collectionRef, formattedData);
  return { id: docRef.id, ...formattedData };
};
