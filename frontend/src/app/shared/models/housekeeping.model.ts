export interface CleaningTask {
  id?: number;
  room: number;
  room_detail?: any;
  assigned_to?: number;
  assigned_to_name?: string;
  task_type: string;
  task_type_display?: string;
  status: string;
  status_display?: string;
  priority: string;
  priority_display?: string;
  notes: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HygieneReport {
  id?: number;
  room: number;
  room_detail?: any;
  inspected_by?: number;
  inspected_by_name?: string;
  rating: string;
  rating_display?: string;
  notes: string;
  issues_found: string;
  passed: boolean;
  inspected_at?: string;
}

export interface SupplyLog {
  id?: number;
  item_name: string;
  quantity: number;
  unit: string;
  used_by?: number;
  used_by_name?: string;
  room?: number;
  room_number?: string;
  notes: string;
  logged_at?: string;
}

export const TASK_TYPES = [
  { value: 'regular_cleaning', label: 'Regular Cleaning' },
  { value: 'deep_cleaning', label: 'Deep Cleaning' },
  { value: 'turnover', label: 'Turnover' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'maintenance', label: 'Maintenance' },
];

export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'inspected', label: 'Inspected' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const HYGIENE_RATINGS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];
