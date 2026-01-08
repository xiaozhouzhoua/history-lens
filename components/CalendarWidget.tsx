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
    <div className="flex flex-col items-center lg:items-end w-full">
        <div className="mb-2 text-center lg:text-right">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#8F8B85]">
                {year}年
            </span>
            <div className="text-lg sm:text-xl font-bold text-[#2D2926] leading-none">
                {month}月
            </div>
        </div>
        
        {/* Responsive container */}
        <div className="bg-[#F7F5EF] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#EBE8E0] shadow-sm w-full max-w-[280px] sm:max-w-[320px]">
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                {weekHeaders.map(day => (
                    <div key={day} className="text-[10px] sm:text-[12px] text-[#8F8B85] font-medium text-center">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 gap-x-0.5 sm:gap-x-1">
                {grid.map((day, i) => {
                    const isToday = day === currentDay;
                    
                    let lunarText = "";
                    if (day) {
                        const cellDate = new Date(year, month - 1, day);
                        lunarText = getLunarDate(cellDate);
                    }

                    return (
                        <div key={i} className="flex justify-center items-center h-9 sm:h-11">
                            {day ? (
                                <div 
                                    className={`
                                        w-full h-full flex flex-col items-center justify-center rounded-md sm:rounded-lg transition-all
                                        ${isToday ? 'text-[#FCFAF7] shadow-sm scale-105 font-bold' : 'text-[#4A4541] hover:bg-[#E6E2D6]'}
                                    `}
                                    style={{ backgroundColor: isToday ? activeColor : 'transparent' }}
                                >
                                    <span className="text-[13px] sm:text-[15px] leading-none mb-[1px] sm:mb-[2px] font-sans">{day}</span>
                                    <span 
                                        className={`text-[8px] sm:text-[10px] transform scale-90 sm:scale-95 leading-none ${isToday ? 'text-[#FCFAF7]/90' : 'text-[#8F8B85]'}`}
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