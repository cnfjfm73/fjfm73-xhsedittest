
import { VisualStyle } from "./types";

export const STYLE_PRESETS: Record<string, VisualStyle> = {
  minimal: {
    theme: 'minimal',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#e5e5e5',
    fontFamily: 'Noto Sans SC',
    titleFontFamily: 'Noto Sans SC',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'center',
    decoration: 'none',
    listStyle: 'dot',
    titleFontSize: 64,
    bodyFontSize: 24,
    lineHeight: 1.6
  },
  bold: {
    theme: 'bold',
    primaryColor: '#ff0000',
    backgroundColor: '#fbbf24', // Amber-400
    textColor: '#000000',
    accentColor: '#000000',
    fontFamily: 'ZCOOL QingKe HuangYou',
    titleFontFamily: 'ZCOOL QingKe HuangYou',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'left',
    decoration: 'shadow',
    listStyle: 'number',
    titleFontSize: 80,
    bodyFontSize: 28,
    lineHeight: 1.4
  },
  memo: {
    theme: 'memo',
    primaryColor: '#4b5563',
    backgroundColor: '#fef3c7', // Yellow notepad
    textColor: '#374151',
    accentColor: '#d97706',
    fontFamily: 'mono',
    titleFontFamily: 'mono',
    bodyFontFamily: 'mono',
    layout: 'left',
    decoration: 'none',
    listStyle: 'dot',
    titleFontSize: 56,
    bodyFontSize: 22,
    lineHeight: 1.8
  },
  journal: {
    theme: 'journal',
    primaryColor: '#be185d',
    backgroundColor: '#fff1f2', // Pink rose
    textColor: '#881337',
    accentColor: '#fbcfe8',
    fontFamily: 'Ma Shan Zheng',
    titleFontFamily: 'Ma Shan Zheng',
    bodyFontFamily: 'Long Cang',
    layout: 'center',
    decoration: 'grid',
    listStyle: 'emoji',
    titleFontSize: 64,
    bodyFontSize: 24,
    lineHeight: 1.8
  },
  educational: {
    theme: 'educational',
    primaryColor: '#1e40af',
    backgroundColor: '#eff6ff', // Blue tint
    textColor: '#1e3a8a',
    accentColor: '#3b82f6',
    fontFamily: 'Noto Sans SC',
    titleFontFamily: 'Noto Sans SC',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'left',
    decoration: 'glass',
    listStyle: 'number',
    titleFontSize: 56,
    bodyFontSize: 24,
    lineHeight: 1.6
  },
  shockwave: {
    theme: 'shockwave',
    primaryColor: '#facc15', // Yellow
    backgroundColor: '#4c1d95', // Violet 900
    textColor: '#ffffff',
    accentColor: '#db2777', // Pink 600
    fontFamily: 'ZCOOL QingKe HuangYou',
    titleFontFamily: 'ZCOOL QingKe HuangYou',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'center',
    decoration: 'none',
    listStyle: 'number',
    titleFontSize: 72,
    bodyFontSize: 26,
    lineHeight: 1.4
  },
  diffused: {
    theme: 'diffused',
    primaryColor: '#5b21b6',
    backgroundColor: '#f3e8ff', // Purple 100
    textColor: '#4c1d95',
    accentColor: '#c084fc',
    fontFamily: 'Noto Sans SC',
    titleFontFamily: 'Noto Sans SC',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'left',
    decoration: 'glass',
    listStyle: 'dot',
    titleFontSize: 64,
    bodyFontSize: 24,
    lineHeight: 1.8
  },
  sticker: {
    theme: 'sticker',
    primaryColor: '#000000',
    backgroundColor: '#dbeafe', // Blue 100 pattern base
    textColor: '#000000',
    accentColor: '#ffffff',
    fontFamily: 'ZCOOL KuaiLe',
    titleFontFamily: 'ZCOOL KuaiLe',
    bodyFontFamily: 'ZCOOL KuaiLe',
    layout: 'left',
    decoration: 'shadow',
    listStyle: 'emoji',
    titleFontSize: 60,
    bodyFontSize: 26,
    lineHeight: 1.5
  },
  cinematic: {
    theme: 'cinematic',
    primaryColor: '#ffffff',
    backgroundColor: '#0f0f0f',
    textColor: '#d4d4d4',
    accentColor: '#404040',
    fontFamily: 'Noto Serif SC',
    titleFontFamily: 'Noto Serif SC',
    bodyFontFamily: 'Noto Serif SC',
    layout: 'center',
    decoration: 'none',
    listStyle: 'dot',
    titleFontSize: 56,
    bodyFontSize: 24,
    lineHeight: 2.0
  },
  tech: {
    theme: 'tech',
    primaryColor: '#06b6d4', // Cyan 500
    backgroundColor: '#0f172a', // Slate 900
    textColor: '#e2e8f0',
    accentColor: '#3b82f6',
    fontFamily: 'mono',
    titleFontFamily: 'mono',
    bodyFontFamily: 'mono',
    layout: 'left',
    decoration: 'grid',
    listStyle: 'number',
    titleFontSize: 56,
    bodyFontSize: 20,
    lineHeight: 1.6
  },
  geek: {
    theme: 'geek',
    primaryColor: '#22c55e', // Green 500
    backgroundColor: '#000000',
    textColor: '#4ade80',
    accentColor: '#14532d',
    fontFamily: 'mono',
    titleFontFamily: 'mono',
    bodyFontFamily: 'mono',
    layout: 'left',
    decoration: 'none',
    listStyle: 'dot',
    titleFontSize: 48,
    bodyFontSize: 20,
    lineHeight: 1.5
  },
  simplicity: {
    theme: 'simplicity',
    primaryColor: '#27272a', // Zinc 800
    backgroundColor: '#fafafa', // Zinc 50
    textColor: '#52525b', // Zinc 600
    accentColor: '#e4e4e7', // Zinc 200
    fontFamily: 'Noto Sans SC',
    titleFontFamily: 'Noto Sans SC',
    bodyFontFamily: 'Noto Sans SC',
    layout: 'left',
    decoration: 'none',
    listStyle: 'dot',
    titleFontSize: 60,
    bodyFontSize: 22,
    lineHeight: 2.0
  }
};