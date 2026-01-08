import React, { useState } from 'react';
import { HistoryEvent } from '../types';
import CalendarWidget from './CalendarWidget';
import { getChineseDate, getSolarTerm } from '../utils/dateUtils';
import { Copy, Check, Image as ImageIcon } from 'lucide-react';

interface HistoryLayoutProps {
  data: HistoryEvent;
  currentDate: Date;
  imageUrl: string | null;
  solarTermImageUrl: string | null;
  loadingImage: boolean;
}

const HistoryLayout: React.FC<HistoryLayoutProps> = ({ data, currentDate, imageUrl, solarTermImageUrl, loadingImage }) => {
  const { fullString, weekDay, year } = getChineseDate(currentDate);
  const solarTerm = getSolarTerm(currentDate);
  const [copied, setCopied] = useState(false);

  // Dynamic styles based on theme, subtle for the "Claude" aesthetic
  const bgGradient = {
    background: `radial-gradient(circle at 50% 0%, ${data.secondaryColor}15 0%, transparent 60%)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
        className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden transition-colors duration-500"
        style={{ backgroundColor: '#F0EEE6' }}
    >
      {/* Dynamic Background subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={bgGradient} />
      
      {/* Watermark - Fixed background element */}
      <div 
        className="absolute bottom-[-5%] left-[-5%] text-[20vw] font-bold text-[#E6E2D6] select-none -rotate-12 pointer-events-none opacity-50 hidden sm:block"
        style={{ fontFamily: '"LXGW WenKai Screen", sans-serif' }}
      >
        {year}
      </div>

      {/* Main Container - 全宽无边框 */}
      <div className="relative w-full bg-[#FDFBF7] min-h-screen flex flex-col z-10">
        
        {/* Header Section: Date, Solar Term & Calendar */}
        <div className="pt-5 px-4 sm:pt-8 sm:px-8 md:pt-10 md:px-12 lg:px-16 pb-5 sm:pb-6 z-10 shrink-0 border-b border-[#EBE8E0]/50">
            {/* Top Row: Date + Solar Term + Calendar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-4 sm:gap-6">
                {/* Left: Date Display */}
                <div className="flex-shrink-0">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-[#2D2926] tracking-tight mb-1 sm:mb-2 font-bold">
                        {fullString}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base font-medium text-[#8F8B85] uppercase tracking-widest pl-0.5 sm:pl-1">
                        {weekDay}
                    </div>
                </div>

                {/* Middle: Solar Term Image - 填补日期和日历之间的空白 */}
                {solarTerm && (
                  <div className="flex-1 hidden lg:flex items-center justify-center px-8">
                      <div className="relative w-full max-w-md h-32 rounded-2xl overflow-hidden bg-[#F7F5EF] border border-[#EBE8E0] group">
                          {/* 背景图片 */}
                          {loadingImage && !solarTermImageUrl ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                  <div className="w-5 h-5 border-2 border-dashed border-[#D97757] rounded-full animate-spin"></div>
                              </div>
                          ) : solarTermImageUrl ? (
                              <img 
                                  src={solarTermImageUrl} 
                                  alt={solarTerm.name} 
                                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-700 group-hover:scale-105"
                              />
                          ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5EF] to-[#EBE8E0]" />
                          )}
                          
                          {/* 纹理叠加 */}
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                          
                          {/* 渐变遮罩 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/50 to-transparent"></div>
                          
                          {/* 节气文字 */}
                          <div className="absolute inset-0 flex items-center px-6">
                              <div className="flex flex-col">
                                  <span className="text-3xl font-bold text-[#2D2926] leading-none mb-1.5" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                                      {solarTerm.name}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-widest text-[#8F8B85] font-semibold">
                                      {solarTerm.en}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
                )}

                {/* Right: Calendar Widget */}
                <div className="flex-shrink-0 w-full lg:w-auto">
                    <CalendarWidget currentDate={currentDate} primaryColor={data.themeColor} />
                </div>
            </div>

            {/* Mobile: Solar Term Banner */}
            {solarTerm && (
              <div className="lg:hidden mt-6 relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-[#F7F5EF] border border-[#EBE8E0] group">
                  {loadingImage && !solarTermImageUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                          <div className="w-5 h-5 border-2 border-dashed border-[#D97757] rounded-full animate-spin"></div>
                      </div>
                  ) : solarTermImageUrl ? (
                      <img 
                          src={solarTermImageUrl} 
                          alt={solarTerm.name} 
                          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                      />
                  ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5EF] to-[#EBE8E0]" />
                  )}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center px-5">
                      <div className="flex flex-col">
                          <span className="text-2xl sm:text-3xl font-bold text-[#2D2926] leading-none mb-1" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                              {solarTerm.name}
                          </span>
                          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#8F8B85] font-semibold">
                              {solarTerm.en}
                          </span>
                      </div>
                  </div>
              </div>
            )}
        </div>

        {/* Content Body - Responsive Grid */}
        <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-16 relative z-10">
            
            {/* Left Column: Visuals */}
            <div className="flex flex-col h-full w-full">
                {/* Category Pill */}
                <div className="flex items-center space-x-2 mb-4 sm:mb-6 shrink-0">
                    <span 
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold tracking-wider bg-[#F2F0E9] border border-[#E6E2D6]"
                        style={{ color: '#5C5855' }}
                    >
                        历史上的今天 · {data.category}
                    </span>
                </div>

                {/* Illustration Area - Adaptive Bento Style */}
                <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[300px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#F7F5EF] border border-[#EBE8E0] flex items-center justify-center group shrink-0 transition-colors shadow-inner">
                    {loadingImage && !imageUrl ? (
                         <div className="animate-pulse flex flex-col items-center">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-dashed animate-spin mb-2" style={{ borderColor: '#D97757' }}></div>
                            <span className="text-xs text-[#8F8B85] font-light">绘制中...</span>
                         </div>
                    ) : imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={data.visualPrompt} 
                            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-700 group-hover:scale-105" 
                        />
                    ) : (
                        <div className="p-6 sm:p-8 text-center text-[#8F8B85]">
                            <ImageIcon size={40} strokeWidth={1} className="mx-auto mb-2 opacity-50" />
                            <span className="text-xs">暂无插图</span>
                        </div>
                    )}
                    
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>
                </div>
            </div>

            {/* Right Column: Event Details */}
            <div className="flex flex-col justify-center h-full">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-[#D97757] shrink-0">
                        {data.year}
                    </span>
                    <div className="group flex items-center gap-2 min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D2926] leading-tight cursor-text break-words">
                            {data.title}
                        </h1>
                        <button
                            onClick={handleCopy}
                            className="p-1 sm:p-1.5 rounded-lg text-[#8F8B85] hover:text-[#D97757] hover:bg-[#EBE8E0] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                            aria-label="复制标题"
                            title="复制标题"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
                
                <p className="text-[#4A4541] text-base sm:text-lg leading-[1.8] text-justify tracking-wide mb-6 sm:mb-10 flex-grow">
                    {data.description}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto pt-4 border-t border-[#EBE8E0]/50">
                    {data.keywords.map((kw, i) => (
                        <span 
                            key={i} 
                            className="text-xs sm:text-sm text-[#5C5855] bg-[#F2F0E9] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#E6E2D6] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[#EBE8E0] hover:border-[#D6D2C4] cursor-default"
                        >
                            #{kw}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLayout;