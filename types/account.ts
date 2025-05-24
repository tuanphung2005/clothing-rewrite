// types/account.ts
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cart: {
    items: Array<{
      id: number;
      quantity: number;
      product: {
        id: number;
        name: string;
        price: number;
        salePrice?: number;
        images: Array<{ url: string }>;
      };
    }>;
  };
}

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}