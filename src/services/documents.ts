
'use server';

import { getSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type Document = {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'proposal';
  content: string;
  created_at: string; // ISO string format
};

type NewDocument = Omit<Document, 'id' | 'created_at'>;

function checkSupabaseClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check your .env file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

/**
 * Fetches all documents from the 'documents' table.
 */
export async function getDocuments(): Promise<Document[]> {
  const supabase = checkSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Could not fetch documents from the database.');
  }

  return data as Document[];
}

/**
 * Adds a new document to the 'documents' table.
 * @param doc - The document to add, without id and created_at.
 * @returns The id of the newly created document.
 */
export async function addDocument(doc: NewDocument): Promise<string> {
  const supabase = checkSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        name: doc.name,
        content: doc.content,
        type: doc.type,
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error adding document:', error.message);
    throw new Error(`Could not add document to the database. Reason: ${error.message}`);
  }

  revalidatePath('/dashboard'); // Invalidate cache for the dashboard page
  return data.id;
}

/**
 * Deletes a document from the 'documents' table by its ID.
 * @param id - The ID of the document to delete.
 */
export async function deleteDocument(id: string): Promise<void> {
  const supabase = checkSupabaseClient();
  const { error } = await supabase.from('documents').delete().match({ id });

  if (error) {
    console.error('Error deleting document:', error);
    throw new Error('Could not delete document from the database.');
  }

  revalidatePath('/dashboard'); // Invalidate cache for the dashboard page
}
