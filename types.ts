
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Collection {
  id: string;
  title: string;
  totalAmount: number;
  perStudentAmount: number;
  startDate: string;
  endDate: string;
  participantIds: string[];
  payments: Record<string, number>; // studentId -> amount paid
}

export interface Refund {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  date: string;
}

export interface AppTheme {
  name: string;
  bg: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  accent: string;
  gradient: string;
}

export type Tab = 'students' | 'collections' | 'stats' | 'settings';
