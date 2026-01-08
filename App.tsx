import React, { useEffect, useState, useCallback } from 'react';
import { HistoryEvent, FetchState } from './types';
import { fetchHistoryEvents, generateIllustration, generateSolarTermIllustration } from './services/geminiService';
import HistoryLayout from './components/HistoryLayout';
import LoadingScreen from './components/LoadingScreen';
import { getSolarTerm } from './utils/dateUtils';

const App: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<Map<number, string | null>>(new Map());
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [solarTermImageUrl, setSolarTermImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchState>(FetchState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 加载指定索引的图片
  const loadImageForIndex = useCallback(async (index: number, event: HistoryEvent) => {
    if (imageUrls.has(index)) return; // 已有缓存
    
    setLoadingImageIndex(index);
    
    if (event.visualPrompt) {
      const refinedPrompt = `${event.visualPrompt}. Use a limited color palette matching ${event.themeColor}. Ultra-clean, negative space, vector art style.`;
      const cacheKey = `${event.year}_${event.title}`;
      try {
        const res = await generateIllustration(refinedPrompt, cacheKey);
        setImageUrls(prev => new Map(prev).set(index, res));
      } catch {
        setImageUrls(prev => new Map(prev).set(index, null));
      }
    } else {
      setImageUrls(prev => new Map(prev).set(index, null));
    }
    
    setLoadingImageIndex(null);
  }, [imageUrls]);

  const loadData = useCallback(async () => {
    let isMounted = true;
    setStatus(FetchState.LOADING_TEXT);
    setErrorMessage(null);
    setEvents([]);
    setCurrentIndex(0);
    setImageUrls(new Map());
    setSolarTermImageUrl(null);

    try {
      // 1. Fetch Text Data (multiple events)
      const data = await fetchHistoryEvents(currentDate);
      
      if (!isMounted) return;
      
      setEvents(data);
      setStatus(FetchState.LOADING_IMAGE);

      // 2. Generate Images in Parallel (First Event + Solar Term)
      const imagePromises: Promise<{ type: string; res: string | null }>[] = [];

      // First event illustration
      if (data[0]?.visualPrompt) {
        const refinedPrompt = `${data[0].visualPrompt}. Use a limited color palette matching ${data[0].themeColor}. Ultra-clean, negative space, vector art style.`;
        const cacheKey = `${data[0].year}_${data[0].title}`;
        imagePromises.push(
          generateIllustration(refinedPrompt, cacheKey)
            .then(res => {
              setImageUrls(prev => new Map(prev).set(0, res));
              return { type: 'main', res };
            })
            .catch(() => ({ type: 'main', res: null }))
        );
      }

      // Solar Term Illustration
      const term = getSolarTerm(currentDate);
      if (term) {
        imagePromises.push(
          generateSolarTermIllustration(term.name, term.en)
            .then(res => ({ type: 'solar', res }))
            .catch(() => ({ type: 'solar', res: null }))
        );
      }

      const results = await Promise.all(imagePromises);

      if (isMounted) {
        results.forEach(item => {
          if (item.type === 'solar') setSolarTermImageUrl(item.res);
        });
        setStatus(FetchState.SUCCESS);
      }
    } catch (error) {
      if (isMounted) {
        setStatus(FetchState.ERROR);
        setErrorMessage(error instanceof Error ? error.message : '加载失败，请稍后重试');
      }
    }

    return () => { isMounted = false; };
  }, [currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 切换事件时加载图片
  useEffect(() => {
    if (events.length > 0 && !imageUrls.has(currentIndex)) {
      loadImageForIndex(currentIndex, events[currentIndex]);
    }
  }, [currentIndex, events, imageUrls, loadImageForIndex]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < events.length - 1 ? prev + 1 : 0));
  };

  // 显示错误状态
  if (status === FetchState.ERROR) {
    return <LoadingScreen error={errorMessage} onRetry={loadData} />;
  }

  // 显示加载状态
  if (status === FetchState.IDLE || status === FetchState.LOADING_TEXT || events.length === 0) {
    return <LoadingScreen />;
  }

  const isLoadingCurrentImage = loadingImageIndex === currentIndex || (status === FetchState.LOADING_IMAGE && currentIndex === 0);

  return (
    <HistoryLayout 
      data={events[currentIndex]} 
      currentDate={currentDate} 
      imageUrl={imageUrls.get(currentIndex) || null}
      solarTermImageUrl={solarTermImageUrl}
      loadingImage={isLoadingCurrentImage}
      totalEvents={events.length}
      currentEventIndex={currentIndex}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
};

export default App;