export interface Shift {
  id: string;
  start_time: string;
  end_time: string | null;
  opening_balance: number;
  closing_balance: number;
  status: 'Open' | 'Closed';
  notes: string | null;
}
