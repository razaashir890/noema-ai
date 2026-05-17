export type UserRole = 
  | 'Owner' 
  | 'ACEO' 
  | 'Sales' 
  | 'Customer Service' 
  | 'Packaging' 
  | 'Inventory' 
  | 'Designer' 
  | 'Photographer';

export interface BrandConfig {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  country: string;
  religion: string;
  whatsappNumber: string;
  websiteUrl: string;
  whatsappApiKey?: string;
  ownerEmail: string;
  activeEvent?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  xp: number;
  level: number;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  category: string;
  fragranceNotes?: {
    top: string;
    heart: string;
    base: string;
  };
  locationStocks?: Record<string, number>;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  products: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled' | 'returned';
  createdAt: string;
  slaDeadline?: string;
  trackingNumber?: string;
  courierLink?: string;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  role?: UserRole;
  createdAt: string;
  deadline?: string;
}
