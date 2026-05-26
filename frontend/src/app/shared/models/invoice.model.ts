import { Booking } from './booking.model';
import { Customer } from './customer.model';

export interface Invoice {
  id?: number;
  booking: number;
  booking_detail?: Booking;
  customer: number;
  customer_detail?: Customer;
  room_charge: number;
  food_charge: number;
  other_charge: number;
  discount: number;
  total_amount?: number;
  amount_paid: number;
  balance_due?: number;
  status: string;
  status_display?: string;
  payment_method: string;
  payment_method_display?: string;
  notes: string;
  issued_at?: string;
  paid_at?: string;
  updated_at?: string;
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];
