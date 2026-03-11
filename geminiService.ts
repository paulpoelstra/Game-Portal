
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizQuestions(theme: string, count: number = 6) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} high-quality pub quiz questions about "${theme}". Include answers and difficulty levels. Return exactly ${count} items.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING, description: "Trivia, Visual, or Logic" },
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
          },
          required: ["id", "category", "question", "answer", "difficulty"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

/**
 * Extracts questions from text or image data and evaluates their difficulty.
 */
export async function extractAndAnalyzeExamples(inputData: string, mimeType: string = 'text/plain') {
  const isImage = mimeType.startsWith('image/');
  
  const contentPart = isImage 
    ? { inlineData: { data: inputData.split(',')[1] || inputData, mimeType } }
    : { text: `Extract all quiz questions and answers from this document: \n\n ${inputData}` };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: "You are a professional quiz editor. Extract questions and answers. For each, assign a difficulty rating from 1 to 5 (1=Very Easy, 5=Extremely Hard) based on general knowledge standards." },
        contentPart
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
            category: { type: Type.STRING },
            aiDifficulty: { type: Type.NUMBER, description: "1-5 scale" }
          },
          required: ["question", "answer", "aiDifficulty"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Extraction failed", e);
    return [];
  }
}

export async function checkTextFit(text: string, maxLength: number = 120) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The following text is for a physical card game. The maximum space is roughly ${maxLength} characters. Evaluate if it fits. If it is too long, provide a shorter, concise version that keeps the core meaning.\n\nText: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fits: { type: Type.BOOLEAN },
          estimatedOverflowChars: { type: Type.NUMBER },
          suggestion: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["fits", "suggestion"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { fits: text.length <= maxLength, suggestion: text };
  }
}

export async function localizeContent(content: any, targetLanguage: string, localize: boolean = true) {
  const prompt = localize 
    ? `Localize and culturally adapt the following board game content for a ${targetLanguage}-speaking audience. Do not just translate literally; adapt references, difficulty, and cultural nuances if necessary. Keep the format exactly the same.`
    : `Translate the following board game content literally into ${targetLanguage}. Keep the format exactly the same.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${prompt}\n\nContent: ${JSON.stringify(content)}`,
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Localization failed", e);
    return content;
  }
}
