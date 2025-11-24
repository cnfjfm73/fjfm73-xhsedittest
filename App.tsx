
import React, { useState, useRef } from 'react';
import { 
  Download, 
  Wand2, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Palette, 
  Loader2,
  Type,
  Plus,
  Trash2,
  FileText,
  Upload,
  XCircle,
  User,
  Calendar
} from 'lucide-react';
import { generatePostContent, extractStyleFromImage, formatRawContent } from './services/geminiService';
import { exportCardsToZip } from './utils/exportUtils';
import CardPreview from './components/CardPreview';
import { PostData, VisualStyle, GenerationState } from './types';
import { STYLE_PRESETS } from './presets';

// Default configuration
const DEFAULT_DATA: PostData = {
  title: "2025年，\n如何重启\n你的人生旷野", // Added line breaks for better initial demo
  pages: [
    "设定清晰且可执行的目标。不要只说“我要变瘦”，要说“我每周二四六慢跑5公里”。量化是执行的第一步。",
    "断舍离你的物理和心理空间。清理掉不穿的衣服，远离消耗你情绪的人。环境越清爽，思路越清晰。",
    "像投资金钱一样投资睡眠。睡饱了，大脑才能高效运转。熬夜是向明天借的高利贷，迟早要还的。"
  ],
  tags: ["个人成长", "自律", "2025规划", "搞钱", "女性成长"],
  authorName: "RedNote 薯队长",
  date: new Date().toLocaleDateString()
};

const DEFAULT_STYLE: VisualStyle = STYLE_PRESETS.minimal;

const THEME_NAMES: Record<string, string> = {
  minimal: '极简白',
  bold: '大字报',
  memo: '备忘录',
  journal: '手帐感',
  educational: '干货类',
  shockwave: '冲击波',
  diffused: '弥散光',
  sticker: '贴纸风',
  cinematic: '电影感',
  tech: '科技蓝',
  geek: '极客黑',
  simplicity: '纯净'
};

const App = () => {
  const [data, setData] = useState<PostData>(DEFAULT_DATA);
  const [style, setStyle] = useState<VisualStyle>(DEFAULT_STYLE);
  const [prompt, setPrompt] = useState('');
  const [rawText, setRawText] = useState('');
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    isAnalyzing: false,
    isExporting: false
  });
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const generated = await generatePostContent(prompt);
      setData(prev => ({
        ...prev,
        title: generated.title || prev.title,
        pages: generated.pages || prev.pages,
        tags: generated.tags || prev.tags
      }));
    } catch (e) {
      alert("内容生成失败，请检查网络或 API Key。");
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleFormatRawText = async () => {
    if (!rawText.trim()) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
        const formatted = await formatRawContent(rawText);
        setData(prev => ({
            ...prev,
            title: formatted.title || prev.title,
            pages: formatted.pages || prev.pages,
            tags: formatted.tags || prev.tags
        }));
    } catch (e) {
        alert("文本格式化失败，请重试。");
    } finally {
        setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleStyleExtractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ''; // Reset for re-upload

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setState(prev => ({ ...prev, isAnalyzing: true }));
      try {
        const extracted = await extractStyleFromImage(base64);
        setStyle(prev => ({ 
            ...prev, 
            ...extracted,
            // Preserve existing background settings if any
            backgroundImage: prev.backgroundImage,
            backgroundApplyMode: prev.backgroundApplyMode,
            backgroundMaskOpacity: prev.backgroundMaskOpacity
        }));
        setActiveTab('style');
      } catch (e) {
        console.error(e);
        alert("风格提取失败，请确保上传的是有效的图片。");
      } finally {
        setState(prev => ({ ...prev, isAnalyzing: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setStyle(prev => ({
        ...prev,
        backgroundImage: base64,
        backgroundApplyMode: prev.backgroundApplyMode || 'all',
        backgroundMaskOpacity: prev.backgroundMaskOpacity || 0.2
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setData(prev => ({
        ...prev,
        avatarImage: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (presetKey: string) => {
    // Preserve background settings when switching themes
    setStyle(prev => ({
        ...STYLE_PRESETS[presetKey],
        backgroundImage: prev.backgroundImage,
        backgroundApplyMode: prev.backgroundApplyMode,
        backgroundMaskOpacity: prev.backgroundMaskOpacity
    }));
  };

  const handleExport = async () => {
    setState(prev => ({ ...prev, isExporting: true }));
    try {
      await exportCardsToZip('cards-container', `xhs-post-${Date.now()}`);
    } catch (e) {
      console.error(e);
      alert("导出失败，请查看控制台日志。");
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const handlePageEdit = (index: number, text: string) => {
    const newPages = [...data.pages];
    newPages[index] = text;
    setData({ ...data, pages: newPages });
  };

  const addPage = () => {
    setData({ ...data, pages: [...data.pages, "点击编辑新页面内容..."] });
  };

  const removePage = (index: number) => {
    const newPages = data.pages.filter((_, i) => i !== index);
    setData({ ...data, pages: newPages });
  };

  const FontSelectorOptions = () => (
    <>
      <optgroup label="✨ 精选设计字体">
        <option value="ZCOOL QingKe HuangYou">站酷庆科黄油体 (网红/大字)</option>
        <option value="ZCOOL KuaiLe">站酷快乐体 (手写/可爱)</option>
        <option value="Ma Shan Zheng">马善政毛笔 (国潮/古风)</option>
        <option value="Long Cang">龙苍体 (行书/洒脱)</option>
        <option value="Zhi Mang Xing">志莽行书 (书法/有力)</option>
        <option value="Liu Jian Mao Cao">刘建毛草 (草书/艺术)</option>
        <option value="Noto Serif SC">思源宋体 (文艺/高端)</option>
        <option value="Noto Sans SC">思源黑体 (现代/通用)</option>
      </optgroup>
      <optgroup label="💻 系统通用字体">
        <option value="sans">系统无衬线 (Sans)</option>
        <option value="serif">系统衬线 (Serif)</option>
        <option value="mono">系统等宽 (Mono)</option>
        <option value="cursive">系统手写 (Hand)</option>
      </optgroup>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-[420px] bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-50 shadow-lg">
        <div className="p-5 border-b border-gray-100">
           <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
             <span className="bg-red-500 text-white p-1 rounded-lg">R</span> 小红书生成器
           </h1>
           <p className="text-xs text-gray-400 mt-1">可视化克隆 & 内容创作助手</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'content' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            内容编辑
          </button>
          <button 
            onClick={() => setActiveTab('style')}
             className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'style' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            视觉风格
          </button>
        </div>

        {/* Scrollable Settings Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {activeTab === 'content' ? (
            <>
              {/* Option 1: AI Generator */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Wand2 size={12} /> AI 灵感创作
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入主题：例如 '低成本独居生活指南' 或 '杭州周末探店'..."
                  className="w-full p-3 rounded-lg border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[60px] bg-white"
                />
                <button 
                  onClick={handleGenerateContent}
                  disabled={state.isGenerating || !prompt}
                  className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {state.isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : "一键生成文案"}
                </button>
              </div>

               {/* Option 2: Format Text */}
               <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <label className="block text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <FileText size={12} /> 粘贴文章 / 长文本
                </label>
                <textarea 
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="在此粘贴长文本，AI 将自动拆分为多张卡片..."
                  className="w-full p-3 rounded-lg border border-orange-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[80px] bg-white"
                />
                <button 
                  onClick={handleFormatRawText}
                  disabled={state.isGenerating || !rawText}
                  className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                   {state.isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : "智能排版"}
                </button>
              </div>

              {/* Manual Edit Section */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">封面标题</label>
                  <textarea 
                    value={data.title}
                    onChange={(e) => setData({...data, title: e.target.value})}
                    rows={2}
                    className="w-full p-2 border rounded-lg text-sm resize-y"
                    placeholder="输入封面标题 (支持换行)"
                  />
                </div>

                {/* Author & Date & Avatar Section */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <User size={12} /> 作者信息 (底部显示)
                      </label>
                      <div className="flex gap-2">
                         <div 
                           className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 cursor-pointer overflow-hidden border border-gray-300 flex items-center justify-center hover:opacity-80 transition-opacity"
                           onClick={() => avatarInputRef.current?.click()}
                           title="点击上传头像"
                         >
                            {data.avatarImage ? (
                               <img src={data.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                               <User size={16} className="text-gray-400" />
                            )}
                         </div>
                         <input 
                           type="file"
                           ref={avatarInputRef}
                           accept="image/*"
                           className="hidden"
                           onChange={handleAvatarUpload}
                         />
                         <input 
                           type="text"
                           value={data.authorName}
                           onChange={(e) => setData({...data, authorName: e.target.value})}
                           placeholder="作者名称"
                           className="flex-1 p-2 border rounded text-sm min-w-0"
                         />
                      </div>
                      {data.avatarImage && (
                          <button 
                            onClick={() => setData({...data, avatarImage: undefined})}
                            className="text-xs text-red-500 mt-1 hover:underline"
                          >
                            移除头像
                          </button>
                      )}
                   </div>

                   <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> 发布日期 (页眉显示)
                      </label>
                      <input 
                        type="text"
                        value={data.date}
                        onChange={(e) => setData({...data, date: e.target.value})}
                        placeholder="例如: 2025/11/24 (留空则隐藏)"
                        className="w-full p-2 border rounded text-sm"
                      />
                   </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">内页内容</label>
                    <button onClick={addPage} className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded text-gray-600 flex items-center gap-1">
                      <Plus size={14} /> 添加页
                    </button>
                  </div>
                  <div className="space-y-3">
                    {data.pages.map((page, idx) => (
                      <div key={idx} className="relative group">
                        <textarea 
                          value={page}
                          onChange={(e) => handlePageEdit(idx, e.target.value)}
                          rows={3}
                          className="w-full p-2 border rounded-lg text-sm pr-8"
                          placeholder={`第 ${idx + 1} 页内容...`}
                        />
                        {data.pages.length > 1 && (
                          <button 
                            onClick={() => removePage(idx)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="删除此页"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签 (逗号分隔)</label>
                  <input 
                    type="text" 
                    value={data.tags.join(', ')}
                    onChange={(e) => setData({...data, tags: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full p-2 border rounded-lg text-sm text-gray-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Style Presets */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    风格预设 (Presets)
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                        <button
                           key={key}
                           onClick={() => handlePresetSelect(key)}
                           className={`p-2 rounded-lg text-left border transition-all ${style.theme === key ? 'border-red-500 ring-1 ring-red-500 bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                            <span className="block text-sm font-bold capitalize mb-1 text-gray-800">
                              {THEME_NAMES[key] || key}
                            </span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{backgroundColor: preset.primaryColor}} />
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{backgroundColor: preset.backgroundColor}} />
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{backgroundColor: preset.accentColor}} />
                            </div>
                        </button>
                    ))}
                 </div>
              </div>

              {/* Background Image Upload */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <label className="block text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <ImageIcon size={12} /> 自定义背景图 (Background)
                 </label>
                 
                 {style.backgroundImage ? (
                    <div className="space-y-3">
                       <div className="relative w-full h-32 rounded-lg overflow-hidden border border-blue-200 group">
                          <img src={style.backgroundImage} className="w-full h-full object-cover" alt="Bg" />
                          <button 
                            onClick={() => setStyle(s => ({...s, backgroundImage: undefined}))}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                          >
                             <XCircle size={16} />
                          </button>
                       </div>
                       
                       <div>
                         <span className="text-xs text-gray-500 block mb-1">应用范围 (Apply To)</span>
                         <div className="flex bg-white rounded-lg p-1 border border-blue-200">
                            {(['all', 'cover', 'content'] as const).map(mode => (
                               <button
                                 key={mode}
                                 onClick={() => setStyle(s => ({...s, backgroundApplyMode: mode}))}
                                 className={`flex-1 text-xs py-1 rounded ${style.backgroundApplyMode === mode ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                               >
                                 {mode === 'all' ? '全部' : mode === 'cover' ? '仅封面' : '仅内页'}
                               </button>
                            ))}
                         </div>
                       </div>

                       <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                             <span>遮罩浓度 (Mask Opacity)</span>
                             <span>{Math.round((style.backgroundMaskOpacity || 0.2) * 100)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0" max="0.9" step="0.05"
                            value={style.backgroundMaskOpacity ?? 0.2}
                            onChange={e => setStyle(s => ({...s, backgroundMaskOpacity: parseFloat(e.target.value)}))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                       </div>
                    </div>
                 ) : (
                    <button 
                      onClick={() => bgInputRef.current?.click()}
                      className="w-full bg-white hover:bg-blue-100 text-blue-600 border border-dashed border-blue-300 py-6 px-4 rounded-lg text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all"
                    >
                       <Upload className="w-5 h-5 opacity-50" />
                       <span>上传背景图片</span>
                    </button>
                 )}
                 <input type="file" accept="image/*" ref={bgInputRef} onChange={handleBackgroundUpload} className="hidden" />
              </div>

              {/* Style Extraction */}
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <label className="block text-xs font-bold text-pink-600 mb-2 uppercase tracking-wide">
                  从图片克隆风格
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleStyleExtractUpload}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={state.isAnalyzing}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                   {state.isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                   上传参考图 (Reference Image)
                </button>
              </div>

              {/* Manual Style Controls */}
              <div className="space-y-5 pt-4 border-t">
                {/* Typography Settings */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type size={16} /> 字体设置 (Typography)
                  </label>
                  
                  {/* Font Family Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">封面标题字体</span>
                      <select 
                        value={style.titleFontFamily || style.fontFamily}
                        onChange={(e) => setStyle({...style, titleFontFamily: e.target.value})}
                        className="w-full p-2 border rounded-lg text-sm bg-white"
                      >
                        <FontSelectorOptions />
                      </select>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">正文内容字体</span>
                      <select 
                        value={style.bodyFontFamily || style.fontFamily}
                        onChange={(e) => setStyle({...style, bodyFontFamily: e.target.value})}
                        className="w-full p-2 border rounded-lg text-sm bg-white"
                      >
                        <FontSelectorOptions />
                      </select>
                    </div>
                  </div>

                  {/* Font Size Sliders */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-gray-500">标题字号</span>
                         <span className="text-xs text-gray-400">{style.titleFontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="32" 
                        max="128" 
                        step="2"
                        value={style.titleFontSize || 64}
                        onChange={(e) => setStyle({...style, titleFontSize: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-gray-500">正文字号</span>
                         <span className="text-xs text-gray-400">{style.bodyFontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" 
                        max="48" 
                        step="2"
                        value={style.bodyFontSize || 24}
                        onChange={(e) => setStyle({...style, bodyFontSize: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Palette size={16} /> 配色方案 (Colors)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">主色 (Primary)</span>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={style.primaryColor} onChange={e => setStyle({...style, primaryColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                        <input type="text" value={style.primaryColor} onChange={e => setStyle({...style, primaryColor: e.target.value})} className="w-full text-xs border rounded p-1" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">背景 (Bg)</span>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={style.backgroundColor} onChange={e => setStyle({...style, backgroundColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                         <input type="text" value={style.backgroundColor} onChange={e => setStyle({...style, backgroundColor: e.target.value})} className="w-full text-xs border rounded p-1" />
                      </div>
                    </div>
                     <div>
                      <span className="text-xs text-gray-500 block mb-1">文字 (Text)</span>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={style.textColor} onChange={e => setStyle({...style, textColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                        <input type="text" value={style.textColor} onChange={e => setStyle({...style, textColor: e.target.value})} className="w-full text-xs border rounded p-1" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">点缀 (Accent)</span>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={style.accentColor} onChange={e => setStyle({...style, accentColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                         <input type="text" value={style.accentColor} onChange={e => setStyle({...style, accentColor: e.target.value})} className="w-full text-xs border rounded p-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <LayoutTemplate size={16} /> 布局与装饰 (Layout)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                      <select 
                        value={style.layout}
                        onChange={(e) => setStyle({...style, layout: e.target.value as any})}
                        className="w-full p-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="left">左对齐</option>
                        <option value="center">居中对齐</option>
                      </select>
                      <select 
                        value={style.decoration}
                        onChange={(e) => setStyle({...style, decoration: e.target.value as any})}
                        className="w-full p-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="none">无 (None)</option>
                        <option value="shadow">硬投影 (Shadow)</option>
                        <option value="glass">毛玻璃 (Glass)</option>
                        <option value="grid">网格背景 (Grid)</option>
                      </select>
                  </div>
                   {/* Line Height Slider */}
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-gray-500">行间距 (Line Height)</span>
                         <span className="text-xs text-gray-400">{style.lineHeight}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1.0" 
                        max="2.5" 
                        step="0.1"
                        value={style.lineHeight || 1.6}
                        onChange={(e) => setStyle({...style, lineHeight: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer Action */}
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={handleExport}
            disabled={state.isExporting}
            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-70"
          >
             {state.isExporting ? (
                <>
                  <Loader2 className="animate-spin" /> 正在打包图片包...
                </>
             ) : (
                <>
                  <Download /> 打包下载 (ZIP)
                </>
             )}
          </button>
        </div>
      </div>

      {/* Right Panel: Preview Workspace */}
      <div className="flex-1 bg-slate-100 overflow-x-auto overflow-y-hidden flex items-center p-10 custom-scrollbar">
        <div 
          id="cards-container" 
          className="flex gap-8 mx-auto items-center"
          style={{ minWidth: 'max-content' }}
        >
          {/* Cover Card */}
          <CardPreview 
            index={0} 
            data={data} 
            style={style} 
            isCover={true} 
            id="card-0"
          />
          
          {/* Content Pages */}
          {data.pages.map((content, idx) => (
            <CardPreview 
              key={idx}
              index={idx + 1} 
              data={data} 
              style={style} 
              isCover={false} 
              id={`card-${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;