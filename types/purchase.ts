// types/purchase.ts
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface UserDetails {
  email: string;
  birthDate: string;
  phone: string;
}

export interface OrderSummary {
  items: Array<{
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutData {
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  userDetails: UserDetails;
  saveAddress: boolean;
}