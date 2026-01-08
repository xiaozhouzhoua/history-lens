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
  const { fullString, weekDay } = getChineseDate(currentDate);
  const solarTerm = getSolarTerm(currentDate);
  const [copied, setCopied] = useState(false);
  const month = currentDate.getMonth() + 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F3ED]">
      {/* 顶部网格区域 */}
      <div className="border-b border-[#E6E2D6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 min-h-[280px]">
            
            {/* 左侧：日期大字 */}
            <div className="col-span-12 md:col-span-2 border-r border-[#E6E2D6] p-4 flex flex-col justify-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C75B3A] leading-none" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                {fullString}
              </div>
              <div className="text-sm text-[#8F8B85] mt-1 tracking-widest">
                {weekDay}
              </div>
            </div>

            {/* 中间区域：节气 + 插图 + 装饰 */}
            <div className="col-span-12 md:col-span-7 grid grid-rows-2 border-r border-[#E6E2D6]">
              {/* 上排：空白框 + 节气卡片 + 空白框 */}
              <div className="grid grid-cols-3 border-b border-[#E6E2D6]">
                {/* 装饰框1 */}
                <div className="border-r border-[#E6E2D6] p-3 flex items-center justify-center">
                  <div className="w-full h-full border border-[#C75B3A]/30 rounded"></div>
                </div>
                {/* 节气卡片 */}
                <div className="border-r border-[#E6E2D6] p-3 flex items-center justify-center">
                  {solarTerm ? (
                    <div className="relative w-full h-full rounded overflow-hidden bg-[#FDFBF7] border border-[#E6E2D6]">
                      {solarTermImageUrl ? (
                        <img src={solarTermImageUrl} alt={solarTerm.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      ) : loadingImage ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-dashed border-[#C75B3A] rounded-full animate-spin"></div>
                        </div>
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#2D2926]" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                          {solarTerm.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#8F8B85] mt-1">
                          {solarTerm.en}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full border border-[#C75B3A]/30 rounded"></div>
                  )}
                </div>
                {/* 装饰框2 */}
                <div className="p-3 flex items-center justify-center">
                  <div className="w-full h-full border border-[#C75B3A]/30 rounded"></div>
                </div>
              </div>
              
              {/* 下排：主插图 */}
              <div className="p-3">
                <div className="relative w-full h-full rounded overflow-hidden bg-[#FDFBF7] border border-[#E6E2D6] flex items-center justify-center">
                  {loadingImage && !imageUrl ? (
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: '#C75B3A' }}></div>
                      <span className="text-xs text-[#8F8B85] mt-2">绘制中...</span>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt={data.visualPrompt} className="absolute inset-0 w-full h-full object-contain p-4 opacity-80" />
                  ) : (
                    <div className="text-center text-[#8F8B85]">
                      <ImageIcon size={32} strokeWidth={1} className="mx-auto mb-1 opacity-40" />
                      <span className="text-xs">暂无插图</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：月份 + 日历 */}
            <div className="col-span-12 md:col-span-3 flex flex-col">
              {/* 月份标识 */}
              <div className="text-right p-3 border-b border-[#E6E2D6]">
                <span className="text-3xl font-light text-[#C75B3A]">{month}月</span>
              </div>
              {/* 日历 */}
              <div className="flex-1 p-3 flex items-start justify-center">
                <CalendarWidget currentDate={currentDate} primaryColor={data.themeColor} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：历史事件详情 */}
      <div className="bg-[#FDFBF7] border-t border-[#E6E2D6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12">
            {/* 左侧标签 */}
            <div className="col-span-12 md:col-span-3 border-r border-[#E6E2D6] p-4">
              <div className="text-xs text-[#8F8B85] mb-2">历史上的今天 · {data.category}</div>
            </div>
            
            {/* 右侧内容 */}
            <div className="col-span-12 md:col-span-9 p-4 md:p-6">
              {/* 标题行 */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold font-mono text-[#C75B3A]">{data.year}</span>
                <h1 className="text-xl md:text-2xl font-bold text-[#2D2926]">{data.title}</h1>
                <button onClick={handleCopy} className="p-1 text-[#8F8B85] hover:text-[#C75B3A] transition-colors" aria-label="复制标题">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              {/* 描述 */}
              <p className="text-[#4A4541] text-sm md:text-base leading-[2] text-justify tracking-wide mb-6">
                {data.description}
              </p>

              {/* 关键词标签 */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E6E2D6]">
                {data.keywords.map((kw: string, i: number) => (
                  <span key={i} className="text-xs text-[#5C5855] bg-[#F2F0E9] px-3 py-1.5 rounded border border-[#E6E2D6] hover:bg-[#E6E2D6] transition-colors cursor-default">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLayout;