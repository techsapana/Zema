import { create } from "zustand";
import { Product } from "../api/productApi";
import toast from "react-hot-toast";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      style: {
        marginTop: '80px', // Below the 20rem (h-20) navbar
        borderRadius: '12px',
        background: '#fff',
        color: '#1e293b', // slate-800
        fontSize: '14px',
        fontWeight: 'bold',
        border: '1px solid #ff4d88', // primary-pink border
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      },
      iconTheme: {
        primary: '#ff4d88', // pink icon
        secondary: '#fff',
      },
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  },
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
