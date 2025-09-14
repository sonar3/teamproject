export interface Equipment {
  id: string;
  category: string;
  customCategory?: string;
  assigneeName: string;
  equipmentInfo: string;
  status: string;
  isInUse: boolean;
  assignedDate: string;
  returnedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFormData {
  category: string;
  customCategory?: string;
  assigneeName: string;
  equipmentInfo: string;
  status: string;
  isInUse: boolean;
  assignedDate: string;
  returnedDate?: string;
  notes?: string;
}

export interface EquipmentResponse {
  success: boolean;
  data?: Equipment;
  message?: string;
}

export interface EquipmentListResponse {
  success: boolean;
  data?: Equipment[];
  message?: string;
}

export const EQUIPMENT_CATEGORIES = [
  { value: 'monitor', label: '모니터' },
  { value: 'desktop', label: '데스크탑' },
  { value: 'laptop', label: '노트북' },
  { value: 'other', label: '기타' }
];

export const EQUIPMENT_STATUS = [
  { value: 'new', label: '신규' },
  { value: 'good', label: '양호' },
  { value: 'fair', label: '보통' },
  { value: 'poor', label: '불량' },
  { value: 'repair', label: '수리중' },
  { value: 'disposed', label: '폐기' }
];

export const USAGE_STATUS = [
  { value: true, label: '사용중' },
  { value: false, label: '미사용' }
];
