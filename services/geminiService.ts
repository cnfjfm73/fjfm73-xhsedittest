import { GoogleGenAI, Type } from "@google/genai";
import { PostData, VisualStyle } from "../types";

// Initialize Gemini client
// Note: In a real environment, ensure process.env.API_KEY is set. 
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePostContent = async (topic: string): Promise<Partial<PostData>> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Write a viral Xiaohongshu (Little Red Book) post in Chinese (Simplified) about: "${topic}". 
      The tone should be engaging, authentic, and use emojis like a real Xiaohongshu influencer.
      Split the main content into 3-4 digestible slides (pages). 
      Provide a catchy title and relevant hashtags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            pages: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "pages", "tags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<PostData>;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Content generation failed:", error);
    throw error;
  }
};

export const formatRawContent = async (rawText: string): Promise<Partial<PostData>> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Act as a professional Chinese social media editor. 
      Analyze the following text and restructure it into a Xiaohongshu carousel format in Chinese (Simplified).
      1. Extract a catchy, short title.
      2. Summarize and split the content into 3-5 logical slides (pages). Keep text concise for images.
      3. Extract keywords for hashtags.
      
      Text to process:
      "${rawText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            pages: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "pages", "tags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<PostData>;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Content formatting failed:", error);
    throw error;
  }
};

export const extractStyleFromImage = async (base64Image: string): Promise<Partial<VisualStyle>> => {
  try {
    // Extract mime type and clean base64 data
    let mimeType = 'image/jpeg';
    let data = base64Image;

    // Check for standard Data URL format: data:image/png;base64,....
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      data = matches[2];
    } else if (base64Image.includes(',')) {
      // Fallback for simple comma separation if regex fails
      const parts = base64Image.split(',');
      data = parts[1];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is good for vision tasks
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          {
            text: `Analyze this image design. Extract the color palette (primary, background, text, accent), layout alignment (center or left), and list style. Return pure JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                primaryColor: { type: Type.STRING },
                backgroundColor: { type: Type.STRING },
                textColor: { type: Type.STRING },
                accentColor: { type: Type.STRING },
                layout: { type: Type.STRING, enum: ["center", "left"] },
                listStyle: { type: Type.STRING, enum: ["dot", "number", "emoji"] }
            }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<VisualStyle>;
    }
    throw new Error("Empty response from Gemini Vision");
  } catch (error) {
    console.error("Style extraction failed:", error);
    throw error;
  }
};