
export interface PostData {
  title: string;
  pages: string[];
  tags: string[];
  authorName: string;
  date: string;
  avatarImage?: string;
}

export type ThemeType = 
  | 'minimal' 
  | 'bold' 
  | 'memo' 
  | 'journal' 
  | 'educational'
  | 'shockwave'
  | 'diffused'
  | 'sticker'
  | 'cinematic'
  | 'tech'
  | 'geek'
  | 'simplicity';

export interface VisualStyle {
  theme: ThemeType;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string; // Generic fallback
  titleFontFamily?: string; // Specific for titles
  bodyFontFamily?: string; // Specific for body text
  layout: 'center' | 'left';
  decoration: 'none' | 'shadow' | 'glass' | 'grid';
  listStyle: 'dot' | 'number' | 'emoji';
  titleFontSize: number;
  bodyFontSize: number;
  lineHeight: number;
  // Custom Background
  backgroundImage?: string;
  backgroundApplyMode?: 'all' | 'cover' | 'content';
  backgroundMaskOpacity?: number;
}

export interface GenerationState {
  isGenerating: boolean;
  isAnalyzing: boolean;
  isExporting: boolean;
}

// Schema for Gemini JSON response
export const GeneratedContentSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    pages: { 
      type: "ARRAY", 
      items: { type: "STRING" } 
    },
    tags: { 
      type: "ARRAY", 
      items: { type: "STRING" } 
    }
  },
  required: ["title", "pages", "tags"]
};

export const ExtractedStyleSchema = {
  type: "OBJECT",
  properties: {
    primaryColor: { type: "STRING", description: "Hex code" },
    backgroundColor: { type: "STRING", description: "Hex code" },
    textColor: { type: "STRING", description: "Hex code" },
    accentColor: { type: "STRING", description: "Hex code" },
    layout: { type: "STRING", enum: ["center", "left"] },
    listStyle: { type: "STRING", enum: ["dot", "number", "emoji"] }
  },
  required: ["primaryColor", "backgroundColor", "textColor", "accentColor", "layout"]
};