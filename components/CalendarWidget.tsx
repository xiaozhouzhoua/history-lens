import React, { useMemo } from 'react';
import { getCalendarGrid, getLunarDate } from '../utils/dateUtils';

interface CalendarWidgetProps {
  currentDate: Date;
  primaryColor: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, primaryColor }) => {
  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth(); // 0-11
  const currentDay = currentDate.getDate();

  const { grid, month, year } = useMemo(() => 
    getCalendarGrid(currentYear, currentMonthIdx), 
    [currentYear, currentMonthIdx]
  );

  const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];
  
  // Use a fixed warm accent for consistency with the Claude theme
  const activeColor = '#D97757'; 

  return (
    <div className="flex flex-col items-center lg:items-end">
        <div className="mb-2 text-center lg:text-right">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#8F8B85]">
                {year}年
            </span>
            <div className="text-lg sm:text-xl font-bold text-[#2D2926] leading-none">
                {month}月
            </div>
        </div>
        
        {/* 固定宽度日历容器 */}
        <div className="bg-[#F7F5EF] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#EBE8E0] shadow-sm" style={{ width: '280px' }}>
            <div className="grid grid-cols-7 gap-1 mb-3">
                {weekHeaders.map(day => (
                    <div key={day} className="text-[11px] sm:text-[12px] text-[#8F8B85] font-medium text-center w-9">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-1">
                {grid.map((day, i) => {
                    const isToday = day === currentDay;
                    
                    let lunarText = "";
                    if (day) {
                        const cellDate = new Date(year, month - 1, day);
                        lunarText = getLunarDate(cellDate);
                    }

                    return (
                        <div key={i} className="flex justify-center items-center w-9 h-10">
                            {day ? (
                                <div 
                                    className={`
                                        w-full h-full flex flex-col items-center justify-center rounded-lg transition-all
                                        ${isToday ? 'text-[#FCFAF7] shadow-sm scale-105 font-bold' : 'text-[#4A4541] hover:bg-[#E6E2D6]'}
                                    `}
                                    style={{ backgroundColor: isToday ? activeColor : 'transparent' }}
                                >
                                    <span className="text-[14px] leading-none mb-[2px] font-sans">{day}</span>
                                    <span 
                                        className={`text-[9px] leading-none ${isToday ? 'text-[#FCFAF7]/90' : 'text-[#8F8B85]'}`}
                                    >
                                        {lunarText}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-full h-full" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default CalendarWidget;