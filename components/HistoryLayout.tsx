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
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* 顶部区域：日期 + 节气 + 插图 + 日历 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 mb-6">
          
          {/* 左栏：日期 */}
          <div className="bg-white rounded-lg p-6 border border-[#E6E2D6]">
            <div className="text-5xl font-bold text-[#C75B3A] leading-tight" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
              {fullString}
            </div>
            <div className="text-sm text-[#8F8B85] mt-2 tracking-widest">{weekDay}</div>
            
            {/* 节气 */}
            {solarTerm && (
              <div className="mt-6 pt-6 border-t border-[#E6E2D6]">
                <div className="relative h-24 rounded-lg overflow-hidden bg-[#F7F5EF] border border-[#E6E2D6]">
                  {solarTermImageUrl ? (
                    <img src={solarTermImageUrl} alt={solarTerm.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  ) : loadingImage ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-dashed border-[#C75B3A] rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center px-4">
                    <div>
                      <div className="text-2xl font-bold text-[#2D2926]" style={{ fontFamily: '"LXGW WenKai Screen", serif' }}>
                        {solarTerm.name}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-[#8F8B85] mt-1">{solarTerm.en}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 中栏：插图 */}
          <div className="bg-white rounded-lg border border-[#E6E2D6] overflow-hidden">
            <div className="relative w-full h-full min-h-[280px] flex items-center justify-center">
              {loadingImage && !imageUrl ? (
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: '#C75B3A' }}></div>
                  <span className="text-sm text-[#8F8B85] mt-3">绘制中...</span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-contain p-6" />
              ) : (
                <div className="text-center text-[#8F8B85]">
                  <ImageIcon size={48} strokeWidth={1} className="mx-auto mb-2 opacity-40" />
                  <span className="text-sm">暂无插图</span>
                </div>
              )}
            </div>
          </div>

          {/* 右栏：月份 + 日历 */}
          <div className="bg-white rounded-lg p-6 border border-[#E6E2D6]">
            <div className="text-right mb-4">
              <span className="text-3xl font-light text-[#C75B3A]">{month}月</span>
            </div>
            <CalendarWidget currentDate={currentDate} primaryColor={data.themeColor} />
          </div>
        </div>

        {/* 底部：历史事件 */}
        <div className="bg-white rounded-lg border border-[#E6E2D6] overflow-hidden">
          <div className="px-6 py-3 bg-[#F7F5EF] border-b border-[#E6E2D6]">
            <span className="text-xs text-[#8F8B85] tracking-wider">历史上的今天 · {data.category}</span>
          </div>
          <div className="p-6">
            {/* 标题 */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold font-mono text-[#C75B3A]">{data.year}</span>
              <h1 className="text-2xl font-bold text-[#2D2926]">{data.title}</h1>
              <button onClick={handleCopy} className="p-1.5 text-[#8F8B85] hover:text-[#C75B3A] transition-colors" aria-label="复制标题">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            {/* 描述 */}
            <p className="text-[#4A4541] text-base leading-[2] text-justify tracking-wide mb-6">
              {data.description}
            </p>

            {/* 关键词 */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E6E2D6]">
              {data.keywords.map((kw: string, i: number) => (
                <span key={i} className="text-xs text-[#5C5855] bg-[#F2F0E9] px-3 py-1.5 rounded border border-[#E6E2D6] hover:bg-[#E6E2D6] transition-colors">
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