export interface MenuItem {
  id?: number;
  name: string;
  category: string;
  category_display?: string;
  description: string;
  price: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export const MENU_CATEGORIES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'dessert', label: 'Dessert' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snack: '🧀',
  beverage: '🥤',
  dessert: '🍮',
};
