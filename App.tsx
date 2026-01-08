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
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [solarTermImageUrl, setSolarTermImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchState>(FetchState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    let isMounted = true;
    setStatus(FetchState.LOADING_TEXT);
    setErrorMessage(null);
    setEvents([]);
    setCurrentIndex(0);
    setImageUrls([]);
    setSolarTermImageUrl(null);

    try {
      // 1. Fetch Text Data (multiple events)
      const data = await fetchHistoryEvents(currentDate);
      
      if (!isMounted) return;
      
      setEvents(data);
      setImageUrls(new Array(data.length).fill(null));
      setStatus(FetchState.LOADING_IMAGE);

      // 2. Generate Images in Parallel (First Event + Solar Term)
      const imagePromises: Promise<{ type: string; res: string | null; index?: number }>[] = [];

      // First event illustration
      if (data[0]?.visualPrompt) {
        const refinedPrompt = `${data[0].visualPrompt}. Use a limited color palette matching ${data[0].themeColor}. Ultra-clean, negative space, vector art style.`;
        imagePromises.push(
          generateIllustration(refinedPrompt)
            .then(res => ({ type: 'main', res, index: 0 }))
            .catch(() => ({ type: 'main', res: null, index: 0 }))
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
          if (item.type === 'main' && item.index !== undefined) {
            setImageUrls(prev => {
              const newUrls = [...prev];
              newUrls[item.index!] = item.res;
              return newUrls;
            });
          }
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

  return (
    <HistoryLayout 
      data={events[currentIndex]} 
      currentDate={currentDate} 
      imageUrl={imageUrls[currentIndex]}
      solarTermImageUrl={solarTermImageUrl}
      loadingImage={status === FetchState.LOADING_IMAGE}
      totalEvents={events.length}
      currentEventIndex={currentIndex}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
};

export default App;