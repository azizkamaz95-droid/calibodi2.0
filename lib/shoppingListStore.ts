import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  fromRecipe?: string;
}

interface ShoppingListState {
  items: ShoppingItem[];
  addFromRecipe: (recipeName: string, ingredients: { name: string; quantity: string }[]) => number;
  addItem: (name: string, quantity?: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
}

export const useShoppingList = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],

      addFromRecipe: (recipeName, ingredients) => {
        const existing = get().items;
        let added = 0;
        const newItems: ShoppingItem[] = [];
        for (const ing of ingredients) {
          const alreadyExists = existing.some(
            (i) => i.name.toLowerCase() === ing.name.toLowerCase()
          );
          if (!alreadyExists) {
            newItems.push({
              id: `${Date.now()}-${Math.random()}`,
              name: ing.name,
              quantity: ing.quantity,
              checked: false,
              fromRecipe: recipeName,
            });
            added++;
          }
        }
        set({ items: [...existing, ...newItems] });
        return added;
      },

      addItem: (name, quantity = '') => {
        if (!name.trim()) return;
        set((s) => ({
          items: [
            ...s.items,
            { id: `${Date.now()}-${Math.random()}`, name: name.trim(), quantity, checked: false },
          ],
        }));
      },

      toggleItem: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
        })),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clearChecked: () =>
        set((s) => ({ items: s.items.filter((i) => !i.checked) })),

      clearAll: () => set({ items: [] }),
    }),
    { name: 'calibodi-shopping-list' }
  )
);
