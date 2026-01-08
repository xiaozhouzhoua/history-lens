import React, { useMemo } from 'react';
import { getCalendarGrid, getLunarDate } from '../utils/dateUtils';

interface CalendarWidgetProps {
  currentDate: Date;
  primaryColor: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, primaryColor }) => {
  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const { grid, month, year } = useMemo(() => 
    getCalendarGrid(currentYear, currentMonthIdx), 
    [currentYear, currentMonthIdx]
  );

  const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];
  const activeColor = '#D97757'; 

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end items-baseline mb-3">
        <span className="text-2xl font-bold text-[#C75B3A]">{year}年{month}月</span>
      </div>
      
      {/* 星期头 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekHeaders.map(day => (
          <div key={day} className="text-[11px] text-[#2D2926] font-semibold text-center py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 - flex-1 撑满 */}
      <div className="grid grid-cols-7 gap-1 flex-1 content-start">
        {grid.map((day, i) => {
          const isToday = day === currentDay;
          let lunarText = "";
          if (day) {
            const cellDate = new Date(year, month - 1, day);
            lunarText = getLunarDate(cellDate);
          }

          return (
            <div key={i} className="flex justify-center items-center aspect-square">
              {day ? (
                <div 
                  className={`
                    w-full h-full flex flex-col items-center justify-center rounded-lg transition-all border
                    ${isToday ? 'text-white shadow-md font-bold border-transparent' : 'text-[#2D2926] hover:bg-[#E6E2D6] border-[#E6E2D6] font-medium'}
                  `}
                  style={{ backgroundColor: isToday ? activeColor : 'transparent' }}
                >
                  <span className="text-sm leading-none mb-0.5">{day}</span>
                  <span className={`text-[9px] leading-none ${isToday ? 'text-white/90' : 'text-[#5C5855]'}`}>
                    {lunarText}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;