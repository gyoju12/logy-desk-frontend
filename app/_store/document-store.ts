import { create } from 'zustand';
import { api } from '@/app/_lib/api';

// As per API.md
export interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
  processing_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

interface DocumentState {
  documents: Document[];
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  pollingIntervalId: NodeJS.Timeout | null;
  startPolling: (interval: number) => void;
  stopPolling: () => void;
}



export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  uploadStatus: 'idle',
  isLoading: false,
  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const fetchedDocuments = await api.getDocuments();
      const documentsArray = Array.isArray(fetchedDocuments) ? fetchedDocuments : fetchedDocuments.documents || [];
      set({ documents: documentsArray, isLoading: false });
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
      await api.uploadDocument(file);
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
      await api.deleteDocument(documentId);
      await get().fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error(`Failed to delete document ${documentId}:`, error);
    } finally {
      set({ isLoading: false });
    }
  },
  pollingIntervalId: null,
  startPolling: (interval) => {
    const { fetchDocuments, pollingIntervalId } = get();
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }
    const id = setInterval(() => {
      fetchDocuments();
    }, interval);
    set({ pollingIntervalId: id });
  },
  stopPolling: () => {
    const { pollingIntervalId } = get();
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      set({ pollingIntervalId: null });
    }
  },
}));
