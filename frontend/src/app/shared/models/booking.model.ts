import { Room } from './room.model';
import { Customer } from './customer.model';

export interface Booking {
  id?: number;
  room: number;
  room_detail?: Room;
  customer: number;
  customer_detail?: Customer;
  check_in: string;
  check_out: string;
  duration?: number;
  status: string;
  status_display?: string;
  total_price?: number;
  adults: number;
  children: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export const BOOKING_STATUSES = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
];
