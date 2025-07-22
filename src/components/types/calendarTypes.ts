export type Category = "Work" | "Personal" | "Important";

export type CalendarEvent = {
  id: string;
  date: string; // ISO string, e.g., '2025-07-09'
  title: string;
  category: Category;
};
