/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, ShieldCheck, Zap, Download, RefreshCw, Loader2, ScanFace, Eye } from "lucide-react";
import { aiService } from "../services/aiService";
import { GalleryImage } from "../types";

interface SmartEditorProps {
  onSaveToGallery: (image: GalleryImage) => void;
}

export function SmartEditor({ onSaveToGallery }: SmartEditorProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showFaceOverlay, setShowFaceOverlay] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setEditedImage(null);
      // Simulate face detection logic
      triggerFaceScan();
    };
    reader.readAsDataURL(file);
  };

  const triggerFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowFaceOverlay(true);
      setTimeout(() => setShowFaceOverlay(false), 3000);
    }, 2000);
  };

  const handleAutoEnhance = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const result = await aiService.editImage(
        originalImage, 
        "Apply cinematic color grading, enhance background lighting, and sharpen the image overall."
      );
      setEditedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workspace Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-cyber-blue" />
              Face Protection System
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Our neural engine detects human subjects and creates a structural lock on facial features, ensuring absolute identity preservation during enhancement.
            </p>
            
            {!originalImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center group cursor-pointer hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-white/40 group-hover:text-cyber-blue transition-colors" />
                </div>
                <p className="text-sm font-bold">Drop Image or Click</p>
                <p className="text-xs text-white/40 mt-1">PNG, JPG up to 10MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            ) : (
              <div className="space-y-4">
                 <div className="flex items-center justify-between gap-4 p-3 bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg">
                    <div className="flex items-center gap-2">
                       <ScanFace className="text-cyber-blue" size={16} />
                       <span className="text-xs font-bold uppercase tracking-wider">Identity Locked</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                 </div>
                 
                 <button
                   onClick={handleAutoEnhance}
                   disabled={isProcessing}
                   className="cyber-button cyber-button-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                   Auto-Enhance Mode
                 </button>
                 
                 <button
                   onClick={handleReset}
                   className="w-full py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                 >
                   Clear Workspace
                 </button>
              </div>
            )}
          </div>

          {editedImage && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card p-6"
            >
               <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Enhancements Applied</h4>
               <ul className="space-y-2">
                  {[
                    "AI Dynamic Background Enhancement",
                    "Volumetric Lighting Adjustment",
                    "Cinema Color Grading Level 4",
                    "Identity Safe-Guard Active"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                       <div className="w-1 h-1 rounded-full bg-cyber-blue" />
                       {item}
                    </li>
                  ))}
               </ul>
               <button 
                  onClick={() => editedImage && onSaveToGallery({
                    id: crypto.randomUUID(),
                    url: editedImage,
                    prompt: "Enhanced with Smart Editor",
                    timestamp: Date.now(),
                    type: 'edited'
                  })}
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10 transition-all"
               >
                  Export Result
               </button>
            </motion.div>
          )}
        </motion.div>

        {/* Viewport */}
        <div className="lg:col-span-2 glass-card overflow-hidden h-[600px] flex items-center justify-center relative bg-[#0a0a0a]">
           {!originalImage ? (
              <div className="text-center opacity-20">
                 <Eye size={64} className="mx-auto mb-4" />
                 <p className="font-display text-2xl">Awaiting Visual Input</p>
              </div>
           ) : (
              <div className="relative w-full h-full flex items-center justify-center p-8">
                 {isScanning && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                       <div className="relative overflow-hidden w-64 h-64 border border-cyber-blue/30 rounded-full">
                          <div className="scan-line" />
                       </div>
                       <p className="mt-8 font-mono text-cyber-blue animate-pulse font-bold text-xs uppercase tracking-widest">Neural Face Scan In Progress...</p>
                    </div>
                 )}

                 {isProcessing && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl">
                       <div className="w-16 h-16 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(0,242,255,0.2)]" />
                       <div className="flex flex-col items-center gap-2">
                          <p className="font-display text-cyber-blue text-sm font-bold uppercase tracking-[0.3em] animate-pulse">AI Processing...</p>
                          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyber-blue to-transparent"
                             />
                          </div>
                          <p className="text-[10px] text-white/40 font-mono tracking-widest mt-2">ENHANCING NEURAL VECTORS</p>
                       </div>
                    </div>
                 )}

                 <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/5 bg-[#050505]">
                    {editedImage ? (
                      <div className="absolute inset-0 select-none">
                        {/* Comparison Slider Implementation */}
                        <div className="relative w-full h-full">
                           <img src={originalImage} className="absolute inset-0 w-full h-full object-contain" alt="Original" />
                           <div 
                              className="absolute inset-0 w-full h-full overflow-hidden" 
                              style={{ width: `${sliderPosition}%`, borderRight: '2px solid #00f2ff' }}
                           >
                              <img src={editedImage} className="absolute inset-0 h-full max-w-none object-contain" style={{ width: '1000px' }} alt="Edited" />
                           </div>
                           
                           {/* Slider Input Handle */}
                           <div 
                              className="absolute top-0 bottom-0 z-10 w-1 bg-cyber-blue cursor-ew-resize flex items-center justify-center"
                              style={{ left: `${sliderPosition}%` }}
                           >
                              <div className="w-8 h-8 rounded-full bg-cyber-blue text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.6)]">
                                 <RefreshCw size={14} className="animate-spin-slow" />
                              </div>
                           </div>
                           
                           <input 
                              type="range"
                              min="0"
                              max="100"
                              step="0.1"
                              value={sliderPosition}
                              onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
                              className="absolute inset-0 z-20 opacity-0 cursor-ew-resize"
                           />
                           
                           <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">Result</div>
                           <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">Original</div>
                        </div>
                      </div>
                    ) : (
                      <img src={originalImage} className="w-full h-full object-contain" alt="Current" />
                    )}
                    
                    {showFaceOverlay && !isScanning && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                         <div className="relative w-40 h-40 border-2 border-cyber-blue/80 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                            <div className="scan-line" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold neon-text-blue whitespace-nowrap uppercase tracking-widest">
                               Identity Locked
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
