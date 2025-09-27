
'use server';

export type Document = {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'proposal';
  content: string;
  created_at: string; // ISO string format
};

type NewDocument = {
  name: string;
  content: string;
  type: 'contract' | 'report' | 'proposal';
};

// In-memory store for documents
let documents: Document[] = [
    {
        id: '1',
        name: 'Initial Contract.txt',
        type: 'contract',
        content: `This is a sample contract document. You can select clauses to summarize or analyze the entire document for risks.
Clause 1: The party of the first part agrees to...
Clause 2: The party of the second part shall...`,
        created_at: new Date().toISOString(),
    }
];

/**
 * Fetches all documents from the in-memory store.
 */
export async function getDocuments(): Promise<Document[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return documents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Adds a new document to the in-memory store.
 * @param doc - The document to add.
 * @returns The id of the newly created document.
 */
export async function addDocument(doc: NewDocument): Promise<string> {
  const newId = (documents.length + 1).toString() + Date.now();
  const newDocument: Document = {
    id: newId,
    name: doc.name,
    type: doc.type,
    content: doc.content,
    created_at: new Date().toISOString(),
  };
  documents.push(newDocument);
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return newId;
}

/**
 * Deletes a document from the in-memory store by its ID.
 * @param id - The ID of the document to delete.
 */
export async function deleteDocument(id: string): Promise<void> {
  documents = documents.filter(doc => doc.id !== id);
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
}
