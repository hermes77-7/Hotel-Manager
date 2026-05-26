import { MenuItem } from './menu-item.model';
import { Customer } from './customer.model';
import { Room } from './room.model';

export interface OrderItem {
  id?: number;
  menu_item: number;
  menu_item_name?: string;
  quantity: number;
  unit_price?: number;
  subtotal?: number;
}

export interface FoodOrder {
  id?: number;
  customer: number;
  customer_name?: string;
  room: number;
  room_number?: string;
  status: string;
  status_display?: string;
  items: OrderItem[];
  total_price?: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'In Preparation' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];
