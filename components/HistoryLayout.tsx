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
      
      {/* Watermark */}
      <div 
        className="absolute bottom-[-5%] right-[-5%] text-[18vw] font-bold text-[#E6E2D6] select-none rotate-12 pointer-events-none opacity-40 hidden md:block"
        style={{ fontFamily: '"LXGW WenKai Screen", sans-serif' }}
      >
        {year}
      </div>

      {/* Main Container */}
      <div className="relative w-full bg-[#FDFBF7] min-h-screen z-10">
        
        {/* Header: 日期 + 日历 + 节气 三栏布局 */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 border-b border-[#EBE8E0]/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 items-center">
                    
                    {/* 左：日期 */}
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="text-3xl sm:text-4xl text-[#2D2926] tracking-tight font-bold">
                                {fullString}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-[#8F8B85] tracking-widest mt-0.5">
                                {weekDay}
                            </div>
                        </div>
                    </div>

                    {/* 中：节气卡片 */}
                    {solarTerm && (
                      <div className="flex justify-center">
                          <div className="relative h-20 sm:h-24 w-full max-w-xs rounded-xl overflow-hidden bg-[#F7F5EF] border border-[#EBE8E0] group">
                              {solarTermImageUrl ? (
                                  <img 
                                      src={solarTermImageUrl} 
                                      alt={solarTerm.name} 
                                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-70"
                                  />
                              ) : loadingImage ? (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-4 h-4 border-2 border-dashed border-[#D97757] rounded-full animate-spin"></div>
                                  </div>
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/90 via-[#FDFBF7]/40 to-transparent"></div>
                              <div className="absolute inset-0 flex items-center px-4">
                                  <div>
                                      <span className="text-xl sm:text-2xl font-bold text-[#2D2926] leading-none" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                                          {solarTerm.name}
                                      </span>
                                      <div className="text-[10px] uppercase tracking-wider text-[#8F8B85] font-medium mt-1">
                                          {solarTerm.en}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}

                    {/* 右：日历 */}
                    <div className="flex justify-center md:justify-end">
                        <CalendarWidget currentDate={currentDate} primaryColor={data.themeColor} />
                    </div>
                </div>
            </div>
        </div>

        {/* Content: 历史事件 */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
                    
                    {/* 左：插图 (占 2 列) */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-[#F2F0E9] border border-[#E6E2D6] text-[#5C5855]">
                                历史上的今天 · {data.category}
                            </span>
                        </div>
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F5EF] border border-[#EBE8E0] flex items-center justify-center group shadow-inner">
                            {loadingImage && !imageUrl ? (
                                 <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full border-2 border-dashed animate-spin mb-2" style={{ borderColor: '#D97757' }}></div>
                                    <span className="text-xs text-[#8F8B85]">绘制中...</span>
                                 </div>
                            ) : imageUrl ? (
                                <img 
                                    src={imageUrl} 
                                    alt={data.visualPrompt} 
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-500 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="text-center text-[#8F8B85]">
                                    <ImageIcon size={36} strokeWidth={1} className="mx-auto mb-2 opacity-50" />
                                    <span className="text-xs">暂无插图</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                        </div>
                    </div>

                    {/* 右：事件详情 (占 3 列) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="flex flex-wrap items-baseline gap-2 mb-3">
                            <span className="text-xl sm:text-2xl font-bold font-mono text-[#D97757]">
                                {data.year}
                            </span>
                            <div className="group flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] leading-tight">
                                    {data.title}
                                </h1>
                                <button
                                    onClick={handleCopy}
                                    className="p-1 rounded-md text-[#8F8B85] hover:text-[#D97757] hover:bg-[#EBE8E0] transition-all"
                                    aria-label="复制标题"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-[#4A4541] text-base sm:text-lg leading-[1.9] text-justify tracking-wide mb-6 flex-grow">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-[#EBE8E0]/50">
                            {data.keywords.map((kw, i) => (
                                <span 
                                    key={i} 
                                    className="text-xs text-[#5C5855] bg-[#F2F0E9] px-3 py-1.5 rounded-md border border-[#E6E2D6] hover:bg-[#EBE8E0] transition-colors cursor-default"
                                >
                                    #{kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLayout;