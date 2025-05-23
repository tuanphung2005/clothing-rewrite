// types/auth.ts
export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  totalItems: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    images: { url: string }[];
  };
}