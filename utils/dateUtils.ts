export const getChineseDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  
  return {
    month,
    day,
    weekDay,
    year: date.getFullYear(),
    fullString: `${month}月${day}日`
  };
};

export const getLunarDate = (date: Date): string => {
  try {
    // Use Intl.DateTimeFormat with Chinese calendar to get numeric values
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      calendar: 'chinese',
      day: 'numeric',
    });
    
    // Check if the formatting returns just a number (common in browsers)
    const part = formatter.formatToParts(date).find(p => p.type === 'day');
    const dayNum = part ? parseInt(part.value, 10) : date.getDate();

    // Map numeric day to Chinese Lunar Day string
    const lunarDays = [
      "", "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
      "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
      "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
    ];

    if (dayNum >= 1 && dayNum <= 30) {
      return lunarDays[dayNum];
    }
    return ""; // Fallback
  } catch (e) {
    console.warn("Lunar date conversion failed", e);
    return "";
  }
};

export const getSolarTerm = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Approximate dates for the 24 Solar Terms
  const terms = [
    { m: 1, d: 5, name: '小寒', en: 'Minor Cold', type: 'cold' },
    { m: 1, d: 20, name: '大寒', en: 'Major Cold', type: 'cold' },
    { m: 2, d: 4, name: '立春', en: 'Start of Spring', type: 'spring' },
    { m: 2, d: 19, name: '雨水', en: 'Rain Water', type: 'rain' },
    { m: 3, d: 6, name: '惊蛰', en: 'Awakening of Insects', type: 'growth' },
    { m: 3, d: 21, name: '春分', en: 'Spring Equinox', type: 'spring' },
    { m: 4, d: 5, name: '清明', en: 'Pure Brightness', type: 'clear' },
    { m: 4, d: 20, name: '谷雨', en: 'Grain Rain', type: 'rain' },
    { m: 5, d: 6, name: '立夏', en: 'Start of Summer', type: 'summer' },
    { m: 5, d: 21, name: '小满', en: 'Grain Buds', type: 'growth' },
    { m: 6, d: 6, name: '芒种', en: 'Grain in Ear', type: 'growth' },
    { m: 6, d: 21, name: '夏至', en: 'Summer Solstice', type: 'summer' },
    { m: 7, d: 7, name: '小暑', en: 'Minor Heat', type: 'heat' },
    { m: 7, d: 23, name: '大暑', en: 'Major Heat', type: 'heat' },
    { m: 8, d: 8, name: '立秋', en: 'Start of Autumn', type: 'autumn' },
    { m: 8, d: 23, name: '处暑', en: 'Limit of Heat', type: 'heat' },
    { m: 9, d: 8, name: '白露', en: 'White Dew', type: 'dew' },
    { m: 9, d: 23, name: '秋分', en: 'Autumn Equinox', type: 'autumn' },
    { m: 10, d: 8, name: '寒露', en: 'Cold Dew', type: 'dew' },
    { m: 10, d: 23, name: '霜降', en: 'Frost\'s Descent', type: 'cold' },
    { m: 11, d: 7, name: '立冬', en: 'Start of Winter', type: 'winter' },
    { m: 11, d: 22, name: '小雪', en: 'Minor Snow', type: 'snow' },
    { m: 12, d: 7, name: '大雪', en: 'Major Snow', type: 'snow' },
    { m: 12, d: 22, name: '冬至', en: 'Winter Solstice', type: 'winter' },
  ];

  let currentTerm = terms[terms.length - 1]; // Default to Winter Solstice of previous year if early Jan
  
  for (const term of terms) {
    if (month > term.m || (month === term.m && day >= term.d)) {
      currentTerm = term;
    } else {
      break; // Sorted by date, so if we haven't passed it, the previous one was correct
    }
  }

  return currentTerm;
};

export const getCalendarGrid = (year: number, month: number) => {
  // Month is 0-indexed (0 = Jan)
  
  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get the weekday of the 1st of the month
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const firstDayObj = new Date(year, month, 1);
  let startDay = firstDayObj.getDay();

  // Adjust for Monday start (Monday=0, Sunday=6) for grid logic if preferred,
  // BUT the standard US/China calendar often visually aligns Sunday first or Monday first.
  // The prompt example: "Jan 1 2026 is Thursday. Row 1: [ ][ ][ ][1]..." 
  // If Thu is 4th slot (index 3), then 0=Mon, 1=Tue, 2=Wed, 3=Thu.
  // So the grid MUST start on Monday.
  
  // Standard getDay(): Sun=0, Mon=1...
  // We want Mon=0, Tue=1 ... Sun=6
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const grid: (number | null)[] = [];
  
  // Add empty slots for days before the 1st
  for (let i = 0; i < adjustedStartDay; i++) {
    grid.push(null);
  }
  
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push(i);
  }

  return {
    grid,
    year,
    month: month + 1, // Return 1-based month for display
    startWeekdayName: '一' // Starting with Monday
  };
};