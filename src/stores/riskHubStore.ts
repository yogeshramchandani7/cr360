import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RiskItem, RiskHubStore } from '../types';

const generateRiskItemId = () => {
  return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Custom storage with error handling for quota exceeded
const storageWithErrorHandling = {
  getItem: (name: string) => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old risk items...');
        // Clear the risk hub store to free up space
        localStorage.removeItem(name);
        // Try again with empty state
        try {
          localStorage.setItem(name, value);
        } catch (retryError) {
          console.error('Failed to save risk items even after clearing:', retryError);
        }
      } else {
        console.error('Error writing to localStorage:', error);
      }
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

export const useRiskHubStore = create<RiskHubStore>()(
  persist(
    (set) => ({
      // Initial state
      items: [],
      filters: {},
      selectedItem: null,
      isDrawerOpen: false,
      editingItem: null,
      prefilledData: null,

      // Add new risk item
      addItem: (itemData) => {
        const newItem: RiskItem = {
          ...itemData,
          id: generateRiskItemId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          lastActivity: 'Created',
        };

        set((state) => {
          // Limit items to 1000 to prevent localStorage quota issues
          const MAX_ITEMS = 1000;
          const updatedItems = [newItem, ...state.items];

          // Keep only the most recent MAX_ITEMS
          const limitedItems = updatedItems.slice(0, MAX_ITEMS);

          return {
            items: limitedItems,
          };
        });
      },

      // Update existing risk item
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  updatedAt: new Date(),
                  // Set completedAt when status changes to 'completed' (only once)
                  completedAt: updates.status === 'completed' && !item.completedAt
                    ? new Date()
                    : item.completedAt,
                  lastActivity: updates.status
                    ? `Changed status to ${updates.status}`
                    : 'Updated',
                }
              : item
          ),
        }));
      },

      // Delete risk item
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        }));
      },

      // Set filters
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      // Clear all filters
      clearFilters: () => {
        set({ filters: {} });
      },

      // Open drawer with optional prefilled data
      openDrawer: (prefilledData) => {
        set({
          isDrawerOpen: true,
          prefilledData: prefilledData || null,
          editingItem: null,
        });
      },

      // Close drawer
      closeDrawer: () => {
        set({
          isDrawerOpen: false,
          prefilledData: null,
          editingItem: null,
        });
      },

      // Select item for viewing
      selectItem: (item) => {
        set({ selectedItem: item });
      },

      // Open drawer for editing existing item
      openEditDrawer: (item) => {
        set({
          isDrawerOpen: true,
          editingItem: item,
          prefilledData: null,
        });
      },
    }),
    {
      name: 'risk-hub-store',
      storage: createJSONStorage(() => storageWithErrorHandling, {
        reviver: (key, value) => {
          // Convert ISO date strings back to Date objects
          if ((key === 'createdAt' || key === 'updatedAt' || key === 'completedAt' || key === 'start' || key === 'end') &&
              typeof value === 'string' &&
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        },
      }),
      partialize: (state) => ({
        items: state.items,
        filters: state.filters,
      }),
    }
  )
);
