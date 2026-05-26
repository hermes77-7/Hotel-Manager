export interface Room {
  id?: number;
  number: string;
  room_type: string;
  room_type_display?: string;
  floor: number;
  price: number;
  status: string;
  status_display?: string;
  description: string;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

// Room type options — matches Django choices
export const ROOM_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'suite', label: 'Suite' },
  { value: 'deluxe', label: 'Deluxe' },
];

// Room status options — matches Django choices
export const ROOM_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'cleaning', label: 'Cleaning' },
];
