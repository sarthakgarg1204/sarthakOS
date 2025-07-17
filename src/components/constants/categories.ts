// components/constants/categories.ts
export const CATEGORIES = ['Work', 'Personal', 'Important'] as const;

export const categoryColorMap: Record<string, string> = {
  Work: 'bg-category-work text-white',
  Personal: 'bg-category-personal text-white',
  Important: 'bg-category-important text-white',
};

export const getCategoryColor = (category: string) =>
  categoryColorMap[category] ?? 'bg-category-default text-white';
