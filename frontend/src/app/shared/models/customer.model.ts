export interface Customer {
  id?: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone: string;
  gender: string;
  gender_display?: string;
  date_of_birth?: string;
  id_type: string;
  id_type_display?: string;
  id_number: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const ID_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'drivers_license', label: "Driver's License" },
];
