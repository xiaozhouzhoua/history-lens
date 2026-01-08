import React, { useEffect, useState, useCallback } from 'react';
import { HistoryEvent, FetchState } from './types';
import { fetchHistoryEvent, generateIllustration, generateSolarTermIllustration } from './services/geminiService';
import HistoryLayout from './components/HistoryLayout';
import LoadingScreen from './components/LoadingScreen';
import { getSolarTerm } from './utils/dateUtils';

const App: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [eventData, setEventData] = useState<HistoryEvent | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [solarTermImageUrl, setSolarTermImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchState>(FetchState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    let isMounted = true;
    setStatus(FetchState.LOADING_TEXT);
    setErrorMessage(null);
    setEventData(null);
    setImageUrl(null);
    setSolarTermImageUrl(null);

    try {
      // 1. Fetch Text Data
      const data = await fetchHistoryEvent(currentDate);
      
      if (!isMounted) return;
      
      setEventData(data);
      setStatus(FetchState.LOADING_IMAGE);

      // 2. Generate Images in Parallel (History Event + Solar Term)
      const imagePromises: Promise<{ type: string; res: string | null }>[] = [];

      // History Illustration
      if (data.visualPrompt) {
        const refinedPrompt = `${data.visualPrompt}. Use a limited color palette matching ${data.themeColor}. Ultra-clean, negative space, vector art style.`;
        imagePromises.push(
          generateIllustration(refinedPrompt)
            .then(res => ({ type: 'main', res }))
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
          if (item.type === 'main') setImageUrl(item.res);
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

  // 显示错误状态
  if (status === FetchState.ERROR) {
    return <LoadingScreen error={errorMessage} onRetry={loadData} />;
  }

  // 显示加载状态
  if (status === FetchState.IDLE || status === FetchState.LOADING_TEXT || !eventData) {
    return <LoadingScreen />;
  }

  return (
    <HistoryLayout 
      data={eventData} 
      currentDate={currentDate} 
      imageUrl={imageUrl}
      solarTermImageUrl={solarTermImageUrl}
      loadingImage={status === FetchState.LOADING_IMAGE}
    />
  );
};

export default App;