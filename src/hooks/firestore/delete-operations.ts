
import { deleteDoc } from 'firebase/firestore';
import { getDocRef } from './common-utils';

// Supprimer un document
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = getDocRef(collectionName, id);
  await deleteDoc(docRef);
  return true;
};
