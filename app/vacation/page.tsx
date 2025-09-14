'use client';

import { useState, useEffect } from 'react';
import { Vacation, VacationListResponse, CalendarDay } from '@/app/lib/types/vacation';
import { AuthGuard } from '@/app/lib/withAuth';
import VacationModal from '@/components/VacationModal';

export default function VacationPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);

  const fetchVacations = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(`/api/vacation/vacations?year=${year}&month=${month}`);
      const data: VacationListResponse = await response.json();
      
      if (data.success && data.data) {
        setVacations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vacations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, [currentDate]);

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dayVacations = vacations.filter(vacation => {
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        return currentDay >= startDate && currentDay <= endDate;
      });
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        vacations: dayVacations
      });
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingVacation(null);
    setIsModalOpen(true);
  };

  const handleVacationClick = (vacation: Vacation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVacation(vacation);
    setSelectedDate(new Date(vacation.startDate));
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingVacation(null);
  };

  const handleModalSuccess = () => {
    fetchVacations();
    handleModalClose();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getVacationTypeLabel = (type: string) => {
    const types = [
      { value: 'annual', label: '연차' },
      { value: 'sick', label: '병가' },
      { value: 'personal', label: '개인사정' },
      { value: 'maternity', label: '출산휴가' },
      { value: 'paternity', label: '육아휴가' },
      { value: 'bereavement', label: '경조사' },
      { value: 'other', label: '기타' }
    ];
    return types.find(t => t.value === type)?.label || type;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">휴가관리</h1>
                <p className="mt-2 text-gray-600">직원들의 휴가 일정을 관리합니다.</p>
              </div>
              <button
                onClick={goToToday}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                오늘로 이동
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            {/* 캘린더 헤더 */}
            <div className="flex justify-between items-center p-6 border-b">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 캘린더 그리드 */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="ml-2 text-gray-600">로딩 중...</p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {/* 요일 헤더 */}
                  {dayNames.map((day) => (
                    <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                      {day}
                    </div>
                  ))}
                  
                  {/* 날짜 셀 */}
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`bg-white min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                      } ${day.isToday ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
                      onClick={() => handleDateClick(day.date)}
                    >
                      <div className="text-sm font-medium mb-1">
                        {day.date.getDate()}
                      </div>
                      
                      {/* 휴가 정보 */}
                      <div className="space-y-1">
                        {day.vacations.map((vacation) => (
                          <div
                            key={vacation.id}
                            onClick={(e) => handleVacationClick(vacation, e)}
                            className="text-xs p-1 rounded bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition-colors"
                            title={`${vacation.employeeName} - ${getVacationTypeLabel(vacation.type)}`}
                          >
                            <div className="font-medium truncate">{vacation.employeeName}</div>
                            <div className="text-red-600">{getVacationTypeLabel(vacation.type)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 범례 */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">범례</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">오늘</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
                <span className="text-sm text-gray-700">휴가</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <span className="text-sm text-gray-700">이전/다음 달</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
                <span className="text-sm text-gray-700">현재 달</span>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && selectedDate && (
          <VacationModal
            selectedDate={selectedDate}
            vacation={editingVacation}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </AuthGuard>
  );
}
