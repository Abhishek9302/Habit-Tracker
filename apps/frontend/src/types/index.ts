export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Checkin {
  id: string;
  habit_id: string;
  checkin_date: string;
  note?: string;
  created_at: string;
  habit_title?: string;
}
