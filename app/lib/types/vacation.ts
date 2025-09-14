export interface Vacation {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacationFormData {
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason?: string;
}

export interface VacationResponse {
  success: boolean;
  data?: Vacation;
  message?: string;
}

export interface VacationListResponse {
  success: boolean;
  data?: Vacation[];
  message?: string;
}

export const VACATION_TYPES = [
  { value: 'annual', label: '연차' },
  { value: 'sick', label: '병가' },
  { value: 'personal', label: '개인사정' },
  { value: 'maternity', label: '출산휴가' },
  { value: 'paternity', label: '육아휴가' },
  { value: 'bereavement', label: '경조사' },
  { value: 'other', label: '기타' }
];

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  vacations: Vacation[];
}
