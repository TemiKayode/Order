export interface User {
  id: string;
  username: string;
  password: string;
  role: 'Admin' | 'Cashier' | 'Manager';
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  barcode?: string;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  totalOrders: number;
  totalSpent: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Original product price
  editablePrice?: number; // Price that can be edited by the user
  total: number;
}

export interface Transaction {
  id: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  posCharge: number;
  total: number;
  paymentMethod: 'Cash' | 'POS' | 'Split'; // Added 'Split'
  cashAmountPaid?: number; // New field for cash amount paid
  posAmountPaid?: number; // New field for POS amount paid
  status: 'Completed' | 'Pending' | 'Cancelled';
  createdAt: string;
  createdBy: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'Login' | 'Product' | 'Order' | 'Customer' | 'User' | 'System';
}

export interface Config {
  BUSINESS_NAME: string;
  BUSINESS_ADDRESS: string;
  PHONE_NUMBERS: string;
  EMAIL_ADDRESS: string;
  POS_CHARGE_AMOUNT: number;
  LOGO_PATH: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  taxRate: number;
}