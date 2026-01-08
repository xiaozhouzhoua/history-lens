import React, { useState } from 'react';
import { HistoryEvent } from '../types';
import CalendarWidget from './CalendarWidget';
import { getChineseDate, getSolarTerm } from '../utils/dateUtils';
import { Copy, Check, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryLayoutProps {
  data: HistoryEvent;
  currentDate: Date;
  imageUrl: string | null;
  solarTermImageUrl: string | null;
  loadingImage: boolean;
  totalEvents: number;
  currentEventIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const HistoryLayout: React.FC<HistoryLayoutProps> = ({ data, currentDate, imageUrl, solarTermImageUrl, loadingImage, totalEvents, currentEventIndex, onPrev, onNext }) => {
  const { fullString, weekDay, fullDateString, lunarString } = getChineseDate(currentDate);
  const solarTerm = getSolarTerm(currentDate);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-full bg-[#F5F3ED] p-4 overflow-hidden">
      {/* 两栏布局 - 撑满整个屏幕 */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] gap-4 h-full">
        
        {/* 左栏：历史上的今天 */}
        <div className="bg-white rounded-lg border border-[#E6E2D6] overflow-hidden flex flex-col">
          {/* 头部标签 */}
          <div className="px-6 py-3 bg-[#F7F5EF] border-b border-[#E6E2D6] flex items-center justify-between">
            <span className="text-xs text-[#5C5855] tracking-wider font-semibold">历史上的今天 · {data.category}</span>
            {totalEvents > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onPrev}
                  className="p-1.5 rounded-md text-[#8F8B85] hover:text-[#C75B3A] hover:bg-[#E6E2D6] transition-colors"
                  aria-label="上一个事件"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs text-[#8F8B85] min-w-[40px] text-center">
                  {currentEventIndex + 1} / {totalEvents}
                </span>
                <button 
                  onClick={onNext}
                  className="p-1.5 rounded-md text-[#8F8B85] hover:text-[#C75B3A] hover:bg-[#E6E2D6] transition-colors"
                  aria-label="下一个事件"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          
          {/* 图文并排 - 撑满剩余高度 */}
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
            {/* 左：图片 */}
            <div className="relative bg-[#F7F5EF] md:border-r border-b md:border-b-0 border-[#E6E2D6]">
              {loadingImage && !imageUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: '#C75B3A' }}></div>
                  <span className="text-sm text-[#8F8B85] mt-3">绘制中...</span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={data.visualPrompt} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8F8B85]">
                  <ImageIcon size={48} strokeWidth={1} className="mb-2 opacity-40" />
                  <span className="text-sm">暂无插图</span>
                </div>
              )}
            </div>
            
            {/* 右：文字内容 */}
            <div className="p-6 flex flex-col overflow-auto">
              {/* 标题 */}
              <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                <span className="text-3xl font-bold font-mono text-[#C75B3A]">{data.year}</span>
                <h1 className="text-2xl font-bold text-[#2D2926]">{data.title}</h1>
                <button onClick={handleCopy} className="p-1 text-[#8F8B85] hover:text-[#C75B3A] transition-colors" aria-label="复制标题">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              {/* 描述 */}
              <p className="text-[#4A4541] text-base leading-[2] text-justify tracking-wide flex-1">
                {data.description}
              </p>

              {/* 关键词 */}
              <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#E6E2D6]">
                {data.keywords.map((kw: string, i: number) => (
                  <span key={i} className="text-xs text-[#5C5855] bg-[#F2F0E9] px-2.5 py-1 rounded border border-[#E6E2D6]">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右栏：日期 + 节气 + 日历 */}
        <div className="flex flex-col gap-4">
          {/* 日期卡片 */}
          <div className="bg-white rounded-lg p-5 border border-[#E6E2D6]">
            <div className="text-4xl font-bold text-[#C75B3A] leading-tight" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
              {fullString}
            </div>
            <div className="text-sm text-[#8F8B85] mt-2">{fullDateString}</div>
            <div className="text-sm text-[#8F8B85]">{lunarString} {weekDay}</div>
          </div>

          {/* 节气卡片 */}
          {solarTerm && (
            <div className="bg-white rounded-lg border border-[#E6E2D6] overflow-hidden">
              <div className="relative h-32">
                {solarTermImageUrl ? (
                  <img src={solarTermImageUrl} alt={solarTerm.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                ) : loadingImage ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F7F5EF]">
                    <div className="w-5 h-5 border-2 border-dashed border-[#C75B3A] rounded-full animate-spin"></div>
                  </div>
                ) : <div className="absolute inset-0 bg-[#F7F5EF]"></div>}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-5">
                  <div className="text-2xl font-bold text-[#2D2926]" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                    {solarTerm.name}
                  </div>
                  <div className="text-xs text-[#5C5855] mt-2 leading-relaxed line-clamp-2">{solarTerm.desc}</div>
                </div>
              </div>
            </div>
          )}

          {/* 日历卡片 - 撑满剩余空间 */}
          <div className="bg-white rounded-lg p-4 border border-[#E6E2D6] flex-1">
            <CalendarWidget currentDate={currentDate} primaryColor={data.themeColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLayout;