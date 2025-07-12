import { create } from 'zustand';
import axios from 'axios';

// As per API.md
export interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
}

interface DocumentState {
  documents: Document[];
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
}

const API_BASE_URL = '/api/v1';

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  uploadStatus: 'idle',
  isLoading: false,
  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get<{ documents: Document[] }>(`${API_BASE_URL}/documents`);
      set({ documents: response.data.documents, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      set({ isLoading: false });
    }
  },
  uploadDocument: async (file) => {
    set({ uploadStatus: 'uploading', isLoading: true });
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE_URL}/documents/upload`, formData);
      set({ uploadStatus: 'success' });
      await get().fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Failed to upload document:", error);
      set({ uploadStatus: 'error' });
    } finally {
      set({ isLoading: false });
      setTimeout(() => set({ uploadStatus: 'idle' }), 3000);
    }
  },
  deleteDocument: async (documentId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
      await get().fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error(`Failed to delete document ${documentId}:`, error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
