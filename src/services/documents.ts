import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export type Document = {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'proposal';
  content: string;
  createdAt: string; // ISO string format
};

const documentsCollection = collection(db, 'documents');

/**
 * Fetches all documents from the 'documents' collection in Firestore,
 * ordered by their creation date in descending order.
 */
export async function getDocuments(): Promise<Document[]> {
  const q = query(documentsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      content: data.content,
      // Convert Firestore Timestamp to ISO string
      createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    };
  });
}

/**
 * Adds a new document to the 'documents' collection in Firestore.
 * @param documentData The data for the new document, excluding the 'id'.
 */
export async function addDocument(documentData: Omit<Document, 'id' | 'createdAt'>): Promise<Document> {
  const docRef = await addDoc(documentsCollection, {
    ...documentData,
    createdAt: serverTimestamp(),
  });

  const now = new Date().toISOString();

  return {
    ...documentData,
id: docRef.id,
    createdAt: now,
  };
}

/**
 * Deletes a document from the 'documents' collection in Firestore by its ID.
 * @param documentId The ID of the document to delete.
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const docRef = doc(db, 'documents', documentId);
  await deleteDoc(docRef);
}
