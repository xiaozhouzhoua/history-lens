import { GoogleGenAI, Type } from "@google/genai";
import { HistoryEvent } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Default fallback data in case API fails or key is missing
const FALLBACK_EVENT: HistoryEvent = {
  year: "2007",
  month: "1",
  day: "9",
  title: "iPhone 发布",
  description: "史蒂夫·乔布斯在旧金山莫斯康展览中心举办的 Macworld 2007 大会上，正式发布了第一代 iPhone。这款设备彻底改变了移动电话行业，将手机、iPod 和互联网通讯设备完美融合，开启了智能手机的新时代。",
  category: "科技",
  keywords: ["创新", "智能手机", "苹果", "变革"],
  visualPrompt: "A minimalist line art illustration of the first generation iPhone on a clean table, schematic style.",
  themeColor: "#007AFF",
  secondaryColor: "#5AC8FA"
};

export const fetchHistoryEvent = async (date: Date): Promise<HistoryEvent> => {
  if (!API_KEY) {
    console.warn("No API Key provided, using fallback data.");
    return FALLBACK_EVENT;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const prompt = `
    Find a historically significant event that happened on ${month}月${day}日 (Month: ${month}, Day: ${day}) in history.
    STRICT REQUIREMENT: The event MUST be related to **Computer Science, Programming, Software Engineering, Artificial Intelligence, or Internet History**.
    
    Return a JSON object with the following fields:
    - year: The year of the event (string)
    - month: The month of the event (string, number)
    - day: The day of the event (string, number)
    - title: A concise title of the event in Chinese (max 20 chars)
    - description: A sophisticated, elegant description of the event in Chinese (approx 80-100 words), story-telling style.
    - category: The category (e.g., 编程语言, 操作系统, 互联网, 人工智能)
    - keywords: An array of 3-4 keywords in Chinese.
    - visualPrompt: An English prompt to generate a minimalist line-art illustration representing this event (e.g. code snippets, abstract networks, vintage computers).
    - themeColor: A hex color code matching the tech mood (e.g., #00FF41, #333333, #007AFF).
    - secondaryColor: A complementary hex color code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025', // Using the latest specified model for best reasoning
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.STRING },
            month: { type: Type.STRING },
            day: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualPrompt: { type: Type.STRING },
            themeColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
          },
          required: ["year", "month", "day", "title", "description", "category", "keywords", "visualPrompt", "themeColor", "secondaryColor"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HistoryEvent;
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Failed to fetch history event:", error);
    return {
        ...FALLBACK_EVENT,
        month: month.toString(),
        day: day.toString(),
        title: `历史上的${month}月${day}日`,
        description: "抱歉，无法获取今日的历史事件详情。请检查网络连接或 API 配置。",
    };
  }
};

export const generateIllustration = async (prompt: string): Promise<string | null> => {
  if (!API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Generate a high quality, ultra-minimalist, clean line-art illustration. White background. Style: Apple Design, elegant, architectural lines. Vertical Portrait layout. Centered composition suitable for cropping. Subject: ${prompt}` }
        ]
      },
    });

    // Iterate to find image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Failed to generate illustration:", error);
    return null;
  }
};

export const generateSolarTermIllustration = async (termName: string, termEn: string): Promise<string | null> => {
  if (!API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            { text: `Generate a high quality, minimalist, artistic stamp-style illustration for the Chinese Solar Term: "${termName}" (${termEn}). 
             Style: Traditional Chinese ink painting meets modern Apple design line art. 
             Composition: Vertical Portrait layout, centered subject. Clean white background. 
             Subject: Nature elements representing the season (e.g. spring sprout, summer lotus, autumn leaf, winter plum).` }
        ]
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Failed to generate solar term illustration:", error);
    return null;
  }
}