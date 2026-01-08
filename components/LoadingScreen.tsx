import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface LoadingScreenProps {
  error?: string | null;
  onRetry?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, onRetry }) => {
  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0EEE6] text-[#5C5855] p-6">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-[#DC2626]" />
          </div>
          <h2 className="text-lg font-semibold text-[#2D2926] mb-2">加载失败</h2>
          <p className="text-sm text-[#8F8B85] mb-6 leading-relaxed">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D97757] text-white rounded-xl font-medium text-sm hover:bg-[#C4654A] transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0EEE6] text-[#5C5855]">
      <div className="relative flex items-center justify-center">
        <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-[#D97757] opacity-20"></div>
        <div className="relative inline-flex rounded-full h-8 w-8 bg-[#D97757] opacity-80"></div>
      </div>
      <p className="mt-8 text-sm font-medium tracking-widest uppercase animate-pulse text-[#8F8B85]">
        正在加载历史...
      </p>
    </div>
  );
};

export default LoadingScreen;