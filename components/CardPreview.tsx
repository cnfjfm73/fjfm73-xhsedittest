
import React from 'react';
import { PostData, VisualStyle } from '../types';
import { Sparkles, Bookmark, Heart, MessageCircle, StickyNote, CheckCircle2, Film, Terminal, Zap, Fingerprint } from 'lucide-react';

interface CardPreviewProps {
  index: number;
  data: PostData;
  style: VisualStyle;
  isCover: boolean;
  id?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ index, data, style, isCover, id }) => {
  const s = {
    bg: style.backgroundColor || '#fcfcfc',
    primary: style.primaryColor || '#1664ff',
    text: style.textColor || '#333333',
    accent: style.accentColor || '#ffd700',
  };

  // Resolve fonts with fallbacks
  const getFontStack = (fontName?: string) => {
    return fontName ? `${fontName}, sans-serif` : "'Noto Sans SC', sans-serif";
  };

  const titleFont = {
    fontFamily: getFontStack(style.titleFontFamily || style.fontFamily),
    whiteSpace: 'pre-wrap' as const // CRITICAL: Preserve user formatting for titles
  };

  const bodyFont = {
    fontFamily: getFontStack(style.bodyFontFamily || style.fontFamily),
    lineHeight: style.lineHeight || 1.6,
    whiteSpace: 'pre-wrap' as const // CRITICAL: Preserve user formatting
  };

  // Custom Background Image Logic
  const renderCustomBackgroundImage = () => {
    if (!style.backgroundImage) return null;

    const mode = style.backgroundApplyMode || 'all';
    const shouldRender = 
      mode === 'all' || 
      (mode === 'cover' && isCover) || 
      (mode === 'content' && !isCover);

    if (!shouldRender) return null;

    return (
      <div className="absolute inset-0 z-0">
        <img 
          src={style.backgroundImage} 
          alt="background" 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: style.backgroundMaskOpacity ?? 0.2 }}
        />
      </div>
    );
  };

  // Theme Decorations
  const renderBackground = () => {
    // 1. SHOCKWAVE BG
    if (style.theme === 'shockwave') {
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-pink-900 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-50" />
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-[80px]" style={{backgroundColor: s.accent}} />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-[80px]" style={{backgroundColor: s.primary}} />
        </div>
      );
    }

    // 2. DIFFUSED BG
    if (style.theme === 'diffused') {
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white/80" /> {/* Base opacity layer for diffused look */}
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[60%] rounded-full blur-[60px] opacity-60" style={{background: s.primary}} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[60%] rounded-full blur-[60px] opacity-60" style={{background: s.accent}} />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xl" />
        </div>
      );
    }

    // 3. TECH BG
    if (style.theme === 'tech') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ 
            backgroundImage: `linear-gradient(${s.primary} 1px, transparent 1px), linear-gradient(90deg, ${s.primary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundColor: 'transparent'
          }} 
        />
      );
    }

    // 4. MEMO BG
    if (style.theme === 'memo') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ 
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${s.accent} 31px, ${s.accent} 32px)`,
            backgroundAttachment: 'local'
          }} 
        />
      );
    }

    // 5. JOURNAL BG
    if (style.theme === 'journal') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ 
            backgroundImage: `radial-gradient(${s.primary} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} 
        />
      );
    }

    // 6. STICKER BG
    if (style.theme === 'sticker') {
      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ 
            backgroundImage: `radial-gradient(${s.primary} 2px, transparent 2px)`,
            backgroundSize: '16px 16px'
          }} 
        />
      );
    }

    // 7. SIMPLICITY BG
    if (style.theme === 'simplicity') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-[20px] border-white opacity-80" />
          <div className="absolute top-8 left-8 right-8 h-[1px]" style={{backgroundColor: s.accent}} />
          <div className="absolute bottom-16 left-8 right-8 h-[1px]" style={{backgroundColor: s.accent}} />
        </div>
      );
    }

    // Default Grid
    return style.decoration === 'grid' ? (
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(${s.primary} 1px, transparent 1px), linear-gradient(90deg, ${s.primary} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
    ) : null;
  };

  const renderContent = () => {
    // --- 1. SHOCKWAVE THEME ---
    if (style.theme === 'shockwave') {
      return (
        <div className="h-full flex flex-col p-8 relative z-10 text-white">
          {isCover ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="animate-pulse mb-6">
                <Zap size={48} fill={s.primary} stroke="none" />
              </div>
              <h1 className="font-black leading-none italic uppercase tracking-tighter" style={{ ...titleFont, textShadow: `4px 4px 0px ${s.accent}`, fontSize: `${style.titleFontSize}px` }}>
                {data.title}
              </h1>
              <div className="mt-8 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-sm font-bold tracking-widest uppercase" style={{...bodyFont, whiteSpace: 'normal'}}>{data.tags[0] || 'TRENDING'}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col pt-10">
               <h2 className="text-6xl font-black italic opacity-20 absolute top-4 right-4" style={titleFont}>{index}</h2>
               <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex-1 overflow-hidden">
                 <p className="font-bold leading-tight" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>{data.pages[index - 1]}</p>
               </div>
            </div>
          )}
        </div>
      );
    }

    // --- 2. DIFFUSED / GLASS THEME ---
    if (style.theme === 'diffused') {
      return (
        <div className="h-full flex flex-col p-8 relative z-10">
          <div className="h-full bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl p-6 flex flex-col">
            {isCover ? (
              <div className="flex-1 flex flex-col justify-center text-center">
                <span className="text-xs font-bold tracking-[0.4em] uppercase opacity-50 mb-4 text-gray-800" style={{...bodyFont, whiteSpace: 'normal'}}>Essence</span>
                <h1 className="font-light text-gray-900 leading-tight mb-8" style={{ ...titleFont, fontSize: `${style.titleFontSize}px` }}>
                  {data.title}
                </h1>
                <div className="flex justify-center gap-2">
                   {data.tags.slice(0,2).map(t => (
                     <span key={t} className="px-3 py-1 bg-white/60 rounded-full text-xs text-gray-600 shadow-sm" style={{...bodyFont, whiteSpace: 'normal'}}>#{t}</span>
                   ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col relative">
                 <div className="w-10 h-10 rounded-full bg-white/80 shadow-inner flex items-center justify-center mb-6 font-bold text-gray-400" style={titleFont}>
                    {index}
                 </div>
                 <p className="text-gray-700 leading-loose font-medium opacity-90" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                    {data.pages[index - 1]}
                 </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- 3. STICKER / POP ART THEME ---
    if (style.theme === 'sticker') {
      return (
        <div className="h-full flex flex-col p-6 relative z-10">
          {isCover ? (
            <div className="flex-1 flex flex-col justify-center items-center">
               <div className="bg-white px-6 py-6 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border-4 border-white rotate-[-2deg] mb-6">
                 <h1 className="font-black text-center leading-tight text-gray-900" style={{ ...titleFont, fontSize: `${style.titleFontSize}px` }}>
                   {data.title}
                 </h1>
               </div>
               <div className="flex flex-wrap justify-center gap-3 mt-4">
                 {data.tags.map(t => (
                   <span key={t} className="bg-white px-3 py-1 rounded-lg text-sm font-bold shadow-md transform hover:scale-110 transition-transform cursor-default" style={{ ...bodyFont, color: s.primary, whiteSpace: 'normal'}}>
                     #{t}
                   </span>
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center">
               <div className="bg-white p-6 rounded-[2rem] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] relative border-2 border-white">
                  <div className="absolute -top-4 -left-2 bg-black text-white px-3 py-1 rounded-lg font-black transform -rotate-6 shadow-md" style={titleFont}>
                    TIP #{index}
                  </div>
                  <p className="font-bold text-gray-800 leading-snug mt-2" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                    {data.pages[index - 1]}
                  </p>
               </div>
            </div>
          )}
        </div>
      );
    }

    // --- 4. CINEMATIC THEME ---
    if (style.theme === 'cinematic') {
      return (
        <div className="h-full flex flex-col bg-black relative z-10 text-white">
          {/* Letterbox Bars */}
          <div className="h-16 bg-black w-full absolute top-0 left-0 z-20 border-b border-gray-900" />
          <div className="h-16 bg-black w-full absolute bottom-0 left-0 z-20 border-t border-gray-900" />
          
          <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
             {/* Film Grain Overlay Simulation */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/200\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>
             
             {isCover ? (
                <div className="text-center space-y-6">
                   <Film className="w-8 h-8 mx-auto opacity-50 mb-4" />
                   <h1 className="tracking-widest leading-relaxed text-gray-100" style={{ ...titleFont, fontSize: `${style.titleFontSize}px` }}>
                      {data.title}
                   </h1>
                   <div className="w-24 h-[1px] bg-white/30 mx-auto" />
                   <p className="text-xs uppercase tracking-[0.2em] opacity-60" style={{...bodyFont, whiteSpace: 'normal'}}>A Story by {data.authorName}</p>
                </div>
             ) : (
                <div className="text-center">
                   <p className="leading-loose text-gray-300 italic" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                      "{data.pages[index - 1]}"
                   </p>
                   <span className="block mt-8 text-xs text-gray-600" style={{...bodyFont, whiteSpace: 'normal'}}>- Scene {index} -</span>
                </div>
             )}
          </div>
        </div>
      );
    }

    // --- 5. GEEK / TERMINAL THEME ---
    if (style.theme === 'geek') {
      return (
        <div className="h-full flex flex-col p-6 font-mono text-green-500 relative z-10 bg-black">
          <div className="flex items-center gap-2 mb-6 opacity-50 border-b border-green-900 pb-2">
            <Terminal size={14} />
            <span className="text-xs">~/posts/{data.date}</span>
          </div>

          {isCover ? (
             <div className="flex-1 flex flex-col justify-center">
                <div className="mb-4 text-xs opacity-70">&gt; executing title_render.sh...</div>
                <h1 className="font-bold leading-tight mb-6" style={{ ...titleFont, fontSize: `${style.titleFontSize}px` }}>
                   <span className="text-white">&gt; </span>{data.title}<span className="animate-pulse">_</span>
                </h1>
                <div className="border border-green-900 p-4 bg-green-900/10 rounded">
                   <p className="text-xs opacity-70 mb-2">// Metadata</p>
                   {data.tags.map(t => (
                      <div key={t} className="text-sm" style={{...bodyFont, whiteSpace: 'normal'}}>var tag = "{t}";</div>
                   ))}
                </div>
             </div>
          ) : (
             <div className="flex-1">
                <div className="text-xs text-green-700 mb-2">/* Slide {index} Content */</div>
                <p className="leading-relaxed text-green-400" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                   {data.pages[index - 1]}
                </p>
             </div>
          )}
        </div>
      );
    }

    // --- 6. TECH / FUTURISTIC THEME ---
    if (style.theme === 'tech') {
       return (
         <div className="h-full flex flex-col p-6 relative z-10">
            {/* HUD Corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2" style={{borderColor: s.primary}} />
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2" style={{borderColor: s.primary}} />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2" style={{borderColor: s.primary}} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2" style={{borderColor: s.primary}} />

            {isCover ? (
               <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-current to-transparent mb-8 opacity-50" style={{color: s.primary}} />
                  <h1 className="font-bold tracking-tight uppercase" style={{ ...titleFont, color: s.text, textShadow: `0 0 10px ${s.primary}`, fontSize: `${style.titleFontSize}px` }}>
                     {data.title}
                  </h1>
                  <div className="mt-8 grid grid-cols-2 gap-2 text-xs font-mono opacity-70" style={{...bodyFont, whiteSpace: 'normal'}}>
                     <div className="border border-gray-700 px-2 py-1 bg-black/20">SYS.READY</div>
                     <div className="border border-gray-700 px-2 py-1 bg-black/20">V.2025</div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col mt-8">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center border border-gray-700 font-mono text-sm" style={{color: s.primary}}>0{index}</div>
                     <div className="h-[1px] flex-1 bg-gray-800" />
                  </div>
                  <p className="font-light tracking-wide leading-relaxed" style={{ ...bodyFont, color: s.text, fontSize: `${style.bodyFontSize}px`}}>
                     {data.pages[index - 1]}
                  </p>
               </div>
            )}
         </div>
       );
    }

    // --- 7. SIMPLICITY THEME ---
    if (style.theme === 'simplicity') {
       return (
          <div className="h-full flex flex-col p-12 relative z-10">
             {isCover ? (
                <div className="flex-1 flex flex-col justify-center">
                   <div className="w-12 h-[2px] mb-8" style={{backgroundColor: s.primary}} />
                   <h1 className="font-normal leading-tight mb-8" style={{ ...titleFont, color: s.primary, fontSize: `${style.titleFontSize}px` }}>
                      {data.title}
                   </h1>
                   <div className="flex items-center gap-2 text-sm" style={{color: s.text}}>
                      <span className="opacity-50">BY {data.authorName.toUpperCase()}</span>
                      <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                      <span className="opacity-50">{data.date}</span>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col pt-4">
                   <span className="text-xs font-bold tracking-widest opacity-30 mb-12 block" style={{color: s.primary}}>PAGE {index < 10 ? `0${index}` : index}</span>
                   <p className="font-light leading-loose" style={{ ...bodyFont, color: s.text, fontSize: `${style.bodyFontSize}px` }}>
                      {data.pages[index - 1]}
                   </p>
                </div>
             )}
          </div>
       );
    }

    // --- DEFAULT & EXISTING THEMES (Minimal, Bold, Journal, Educational) ---
    // Minimal
    if (style.theme === 'minimal') {
      return (
        <div className="h-full flex flex-col p-8 relative z-10">
          {isCover ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <span className="text-xs tracking-[0.3em] uppercase mb-4 opacity-50" style={{...bodyFont, whiteSpace: 'normal'}}>Collection</span>
              <h1 className="font-light leading-tight mb-6 text-gray-900" style={{ ...titleFont, color: s.primary, fontSize: `${style.titleFontSize}px` }}>
                {data.title}
              </h1>
              <div className="w-12 h-[1px] bg-black/20 my-4" />
              <p className="text-sm opacity-60 font-light italic" style={{...bodyFont, whiteSpace: 'normal'}}>{data.date}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col pt-10">
               <div className="flex items-center gap-3 mb-8 opacity-40">
                  <span className="text-4xl font-thin" style={titleFont}>{index < 10 ? `0${index}` : index}</span>
                  <div className="h-[1px] flex-1 bg-current" />
               </div>
               <div className="leading-relaxed font-light text-gray-700" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                  {data.pages[index - 1]}
               </div>
            </div>
          )}
        </div>
      );
    }

    // Bold
    if (style.theme === 'bold') {
      return (
        <div className="h-full flex flex-col p-6 border-4 border-black box-border relative z-10">
          {isCover ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-black text-white inline-block px-4 py-1 text-sm font-black uppercase mb-4 self-start transform -rotate-2" style={{...bodyFont, whiteSpace: 'normal'}}>
                ATTENTION
              </div>
              <h1 className="font-black leading-[0.9] uppercase tracking-tighter mb-4" style={{ ...titleFont, color: s.primary, textShadow: '2px 2px 0px rgba(0,0,0,0.1)', fontSize: `${style.titleFontSize}px` }}>
                {data.title}
              </h1>
              <div className="mt-auto border-t-4 border-black pt-4 flex gap-2 flex-wrap">
                {data.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="px-2 py-1 bg-white border-2 border-black text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]" style={{...bodyFont, whiteSpace: 'normal'}}>
                     #{tag}
                   </span>
                ))}
              </div>
            </div>
          ) : (
             <div className="flex-1 flex flex-col">
                <h2 className="text-8xl font-black opacity-10 absolute -right-4 -top-4 select-none" style={{...titleFont, color: s.primary}}>{index}</h2>
                <div className="relative z-10 mt-12 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-1">
                   <p className="font-bold leading-tight" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>{data.pages[index - 1]}</p>
                </div>
             </div>
          )}
        </div>
      );
    }

    // Educational
    if (style.theme === 'educational') {
      return (
        <div className="h-full flex flex-col p-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{...bodyFont, backgroundColor: s.primary, whiteSpace: 'normal'}}>
               {isCover ? 'GUIDE' : `PART 0${index}`}
            </div>

            {isCover ? (
               <div className="flex-1 flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white text-2xl shadow-lg" style={{backgroundColor: s.accent}}>
                     📚
                  </div>
                  <h1 className="font-bold mb-4 text-gray-800 leading-snug" style={{ ...titleFont, fontSize: `${style.titleFontSize}px` }}>
                     {data.title}
                  </h1>
                  <div className="mt-4 space-y-2">
                     {data.tags.slice(0,3).map(tag => (
                        <div key={tag} className="flex items-center gap-2 text-sm text-gray-600" style={{...bodyFont, whiteSpace: 'normal'}}>
                           <CheckCircle2 size={14} style={{color: s.primary}} />
                           <span>{tag}</span>
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col mt-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{...titleFont, color: s.primary}}>
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs">{index}</span>
                     Key Point
                  </h3>
                  <div className="text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-100" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                     {data.pages[index - 1]}
                  </div>
                  <div className="mt-auto">
                     <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: `${(index / data.pages.length) * 100}%`, backgroundColor: s.primary}} />
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      );
    }

    // Fallback / Journal
    return (
      <div className="h-full flex flex-col p-6 relative z-10">
        {isCover ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-2 border border-current opacity-60" style={{...bodyFont, whiteSpace: 'normal'}}>
              NEW POST
            </div>
            <h1 
              className="font-black leading-tight tracking-tight"
              style={{ ...titleFont, color: s.primary, fontSize: `${style.titleFontSize}px` }}
            >
              {data.title || "Untitled Post"}
            </h1>
            <div 
              className="h-1 w-16 rounded-full" 
              style={{ backgroundColor: s.accent }} 
            />
             <div className="flex flex-wrap justify-center gap-2 mt-4">
              {data.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-sm opacity-70" style={{...bodyFont, whiteSpace: 'normal'}}>#{tag.replace('#','')}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col ${style.layout === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
             <h2 className="text-xl font-bold mb-6 border-b-2 pb-2 inline-block" style={{ ...titleFont, borderColor: s.accent }}>
                0{index} / <span className="text-sm font-normal opacity-60">KEY POINTS</span>
             </h2>
             
             <div className="prose prose-sm max-w-none flex-1 overflow-hidden whitespace-pre-wrap leading-relaxed opacity-90" style={{ ...bodyFont, fontSize: `${style.bodyFontSize}px` }}>
                {data.pages[index - 1]}
             </div>
             
             <div className="mt-auto self-end opacity-20">
                <Sparkles size={48} fill={s.accent} stroke="none" />
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      id={id}
      className={`export-card relative overflow-hidden flex flex-col shadow-xl flex-shrink-0 transition-all duration-300`}
      style={{
        width: '375px',
        height: '500px',
        backgroundColor: s.bg,
        color: s.text,
      }}
    >
      {/* 0. Custom Background Image Layer (Z-0) */}
      {renderCustomBackgroundImage()}

      {/* 1. Theme Specific Backgrounds (Z-0 or Z-1) */}
      {renderBackground()}
      
      {/* Top Bar - Hidden in Cinematic */}
      {style.theme !== 'cinematic' && (
        <div className="p-4 flex justify-end items-center opacity-50 text-xs z-20 relative" style={{...bodyFont, whiteSpace: 'normal'}}>
           {/* Header Date - Optional */}
           {data.date && <span>{data.date}</span>}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 z-20 relative">
         {renderContent()}
      </div>

      {/* Footer - Hidden in Cinematic */}
      {style.theme !== 'cinematic' && (
        <div className="p-4 z-20 relative border-t border-black/5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                   {data.avatarImage ? (
                     <img src={data.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                   ) : (
                     <Fingerprint size={20} className="opacity-50" />
                   )}
              </div>
              <span className="text-xs font-medium opacity-80" style={{...bodyFont, whiteSpace: 'normal'}}>{data.authorName}</span>
            </div>
            
            {/* Footer Interaction Icons REMOVED as per request */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;