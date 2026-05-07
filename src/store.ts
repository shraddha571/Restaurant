import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './types';

export interface StoreState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number, weight: string, orderType: string) => void;
  updateQuantity: (id: string | number, weight: string, orderType: string, delta: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) => set((state) => {
        // Items are unique based on ID, weight, AND orderType
        const existingItemIndex = state.cartItems.findIndex(i => 
          i.id === item.id && 
          i.weight === item.weight && 
          i.orderType === item.orderType
        );
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...state.cartItems];
          updatedItems[existingItemIndex] = { 
            ...updatedItems[existingItemIndex], 
            qty: updatedItems[existingItemIndex].qty + item.qty 
          };
          return { cartItems: updatedItems };
        }
        return { cartItems: [...state.cartItems, item] };
      }),
      removeFromCart: (id, weight, orderType) => set((state) => ({
        cartItems: state.cartItems.filter(i => !(i.id === id && i.weight === weight && i.orderType === orderType))
      })),
      updateQuantity: (id, weight, orderType, delta) => set((state) => ({
        cartItems: state.cartItems.map(i => {
          if (i.id === id && i.weight === weight && i.orderType === orderType) {
            const newQty = Math.max(1, i.qty + delta);
            return { ...i, qty: newQty };
          }
          return i;
        })
      })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'raghuveer-storage',
    }
  )
);
