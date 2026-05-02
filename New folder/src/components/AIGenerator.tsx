/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Wand2, Download, Plus, Loader2, History, RotateCcw } from "lucide-react";
import { aiService } from "../services/aiService";
import { StyleOption, GalleryImage } from "../types";

interface AIGeneratorProps {
  onSaveToGallery: (image: GalleryImage) => void;
}

export function AIGenerator({ onSaveToGallery }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [style, setStyle] = useState<StyleOption>("Realistic");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("prompt_history");
    return saved ? JSON.parse(saved) : [];
  });

  const styles: StyleOption[] = ["Realistic", "Anime", "Cyberpunk", "3D"];

  useEffect(() => {
    localStorage.setItem("prompt_history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (p: string) => {
    if (!p || history.includes(p)) return;
    setHistory(prev => [p, ...prev].slice(0, 10)); // Keep last 10
  };

  const handleEnhance = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    const enhanced = await aiService.enhancePrompt(prompt);
    setEnhancedPrompt(enhanced);
    addToHistory(prompt);
    setIsEnhancing(false);
  };

  const handleGenerate = async () => {
    const finalPrompt = enhancedPrompt || prompt;
    if (!finalPrompt) return;
    
    setIsGenerating(true);
    addToHistory(prompt);
    try {
      const imageUrl = await aiService.generateImage(finalPrompt, style);
      setResultImage(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (resultImage) {
      onSaveToGallery({
        id: crypto.randomUUID(),
        url: resultImage,
        prompt: enhancedPrompt || prompt,
        style,
        timestamp: Date.now(),
        type: 'generated'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 max-w-7xl mx-auto">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8 border-cyber-blue/10"
      >
        <h3 className="text-xl font-display font-bold mb-6 flex items-center justify-between">
          <span className="neon-text-blue uppercase tracking-widest text-xs">Prompt Engine</span>
          <span className="font-mono text-[10px] px-2 py-1 bg-cyber-blue/20 rounded text-cyber-blue">V4.2 ACTIVE</span>
        </h3>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">
              Initial Concept
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A majestic lion in a futuristic jungle..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-cyber-blue transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !prompt}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-cyber-blue/10 hover:border-cyber-blue/50 transition-all text-sm font-bold active:scale-95 disabled:opacity-50"
          >
            {isEnhancing ? <Loader2 className="animate-spin" /> : <Wand2 size={18} className="text-cyber-blue" />}
            Auto-Enhance Prompt
          </button>

          <AnimatePresence>
            {enhancedPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[10px] bg-cyber-blue text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">AI Enhanced</div>
                </div>
                <p className="text-sm italic text-white/80 leading-relaxed">"{enhancedPrompt}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 block">
              Aesthetic Logic
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    style === s 
                      ? 'bg-cyber-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt && !enhancedPrompt)}
            className="cyber-button cyber-button-primary w-full mt-4 flex items-center justify-center gap-3 disabled:opacity-50 text-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" /> 
                SYNTHESIZING...
              </>
            ) : (
              <>
                GENERATE VISUAL
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Result Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-4 relative flex items-center justify-center min-h-[400px] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {resultImage ? (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full flex flex-col"
            >
               <img src={resultImage} alt="AI Generated" className="w-full h-full object-cover rounded-xl shadow-2xl" />
               <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  <button 
                     onClick={handleSave}
                     className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                  >
                     <Plus size={18} /> Save to Gallery
                  </button>
                  <a 
                     href={resultImage} 
                     download="generated-image.png"
                     className="w-14 bg-cyber-blue text-black h-full py-3 rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                  >
                     <Download size={18} />
                  </a>
               </div>
            </motion.div>
          ) : (
            <motion.div 
               key="placeholder"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <ImageIcon className="text-white/10" size={32} />
              </div>
              <p className="text-white/20 font-display text-lg">Waiting for Neural Feed...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isGenerating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
             <div className="text-cyber-blue font-mono mb-4 text-sm animate-pulse tracking-widest font-bold">AI PROCESSING...</div>
             <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-1/2 h-full bg-cyber-blue shadow-[0_0_15px_rgba(0,242,255,1)]"
                />
             </div>
          </div>
        )}
      </motion.div>

      {/* History Section */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6 border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-cyber-blue" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Neural History</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(h);
                    setEnhancedPrompt("");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyber-blue/40 hover:bg-cyber-blue/5 transition-all text-[11px] group"
                >
                  <RotateCcw size={12} className="text-white/20 group-hover:text-cyber-blue transition-colors" />
                  <span className="truncate max-w-[150px]">{h}</span>
                </button>
              ))}
              <button 
                onClick={() => setHistory([])}
                className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors ml-auto flex items-center gap-1"
              >
                Clear History
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
