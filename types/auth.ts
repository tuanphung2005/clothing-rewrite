// types/auth.ts
export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name?: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>; // Add this
  checkAuth: () => Promise<void>;          // Add this
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  setCartItems: (items: CartItem[]) => void;
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