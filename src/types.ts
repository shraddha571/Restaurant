export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: 'mithai' | 'cakes' | 'dry-fruits' | 'hampers' | 'snacks';
  tags?: string[];
  isOutOfStock?: boolean;
}

export interface HamperOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  img: string;
  weight: string;
  orderType: 'parcel' | 'required_now' | 'dine-in';
}

export interface Order {
  id?: string;
  token: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'online' | 'offline';
  paymentStatus: 'paid' | 'unpaid';
  orderType: 'dine-in' | 'takeaway';
  status: 'placed' | 'confirmed' | 'preparing' | 'completed';
  createdAt: any;
}
