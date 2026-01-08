export const getChineseDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  
  // 获取农历月日
  const lunarMonths = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const lunarDays = [
    "", "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];
  
  let lunarMonthStr = '';
  let lunarDayStr = '';
  
  try {
    const monthFormatter = new Intl.DateTimeFormat('zh-CN', { calendar: 'chinese', month: 'numeric' });
    const dayFormatter = new Intl.DateTimeFormat('zh-CN', { calendar: 'chinese', day: 'numeric' });
    
    const monthPart = monthFormatter.formatToParts(date).find(p => p.type === 'month');
    const dayPart = dayFormatter.formatToParts(date).find(p => p.type === 'day');
    
    const lunarMonth = monthPart ? parseInt(monthPart.value, 10) : 1;
    const lunarDay = dayPart ? parseInt(dayPart.value, 10) : 1;
    
    lunarMonthStr = lunarMonths[lunarMonth] || '';
    lunarDayStr = lunarDays[lunarDay] || '';
  } catch (e) {
    console.warn("Lunar date conversion failed", e);
  }
  
  return {
    month,
    day,
    weekDay,
    year,
    lunarMonth: lunarMonthStr,
    lunarDay: lunarDayStr,
    fullString: `${month}月${day}日`,
    fullDateString: `${year}年${month}月${day}日`,
    lunarString: `农历${lunarMonthStr}${lunarDayStr}`
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

  // Approximate dates for the 24 Solar Terms with descriptions
  const terms = [
    { m: 1, d: 5, name: '小寒', en: 'Minor Cold', type: 'cold', desc: '冷气积久而寒，小寒是天气寒冷但还没有到极点的意思。' },
    { m: 1, d: 20, name: '大寒', en: 'Major Cold', type: 'cold', desc: '大寒是天气寒冷到极致的意思，是一年中最冷的时节。' },
    { m: 2, d: 4, name: '立春', en: 'Start of Spring', type: 'spring', desc: '立春是二十四节气之首，标志着春季的开始。' },
    { m: 2, d: 19, name: '雨水', en: 'Rain Water', type: 'rain', desc: '雨水节气标志着降雨开始增多，气温回升。' },
    { m: 3, d: 6, name: '惊蛰', en: 'Awakening of Insects', type: 'growth', desc: '春雷乍动，惊醒了蛰伏在土中冬眠的动物。' },
    { m: 3, d: 21, name: '春分', en: 'Spring Equinox', type: 'spring', desc: '春分日昼夜平分，是春季九十天的中分点。' },
    { m: 4, d: 5, name: '清明', en: 'Pure Brightness', type: 'clear', desc: '天气晴朗，草木繁茂，是祭祖扫墓的重要节日。' },
    { m: 4, d: 20, name: '谷雨', en: 'Grain Rain', type: 'rain', desc: '雨生百谷，是播种移苗的最佳时节。' },
    { m: 5, d: 6, name: '立夏', en: 'Start of Summer', type: 'summer', desc: '立夏表示夏季的开始，万物繁茂。' },
    { m: 5, d: 21, name: '小满', en: 'Grain Buds', type: 'growth', desc: '麦类等夏熟作物籽粒开始饱满，但尚未成熟。' },
    { m: 6, d: 6, name: '芒种', en: 'Grain in Ear', type: 'growth', desc: '有芒的麦子快收，有芒的稻子可种。' },
    { m: 6, d: 21, name: '夏至', en: 'Summer Solstice', type: 'summer', desc: '夏至是一年中白昼最长的一天。' },
    { m: 7, d: 7, name: '小暑', en: 'Minor Heat', type: 'heat', desc: '小暑表示天气开始炎热，但还不是最热的时候。' },
    { m: 7, d: 23, name: '大暑', en: 'Major Heat', type: 'heat', desc: '大暑是一年中最热的时期。' },
    { m: 8, d: 8, name: '立秋', en: 'Start of Autumn', type: 'autumn', desc: '立秋是秋季的开始，暑去凉来。' },
    { m: 8, d: 23, name: '处暑', en: 'Limit of Heat', type: 'heat', desc: '处暑表示炎热的暑天即将结束。' },
    { m: 9, d: 8, name: '白露', en: 'White Dew', type: 'dew', desc: '天气转凉，露水凝结成白色。' },
    { m: 9, d: 23, name: '秋分', en: 'Autumn Equinox', type: 'autumn', desc: '秋分日昼夜平分，是秋季九十天的中分点。' },
    { m: 10, d: 8, name: '寒露', en: 'Cold Dew', type: 'dew', desc: '露水更冷，即将凝结成霜。' },
    { m: 10, d: 23, name: '霜降', en: 'Frost\'s Descent', type: 'cold', desc: '天气渐冷，开始有霜。' },
    { m: 11, d: 7, name: '立冬', en: 'Start of Winter', type: 'winter', desc: '立冬是冬季的开始，万物收藏。' },
    { m: 11, d: 22, name: '小雪', en: 'Minor Snow', type: 'snow', desc: '开始降雪，但雪量不大。' },
    { m: 12, d: 7, name: '大雪', en: 'Major Snow', type: 'snow', desc: '降雪量增多，地面可能积雪。' },
    { m: 12, d: 22, name: '冬至', en: 'Winter Solstice', type: 'winter', desc: '冬至是一年中白昼最短的一天。' },
  ];

  let currentTerm = terms[terms.length - 1];
  
  for (const term of terms) {
    if (month > term.m || (month === term.m && day >= term.d)) {
      currentTerm = term;
    } else {
      break;
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