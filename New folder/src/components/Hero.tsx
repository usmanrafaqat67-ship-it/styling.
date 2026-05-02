/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Upload } from "lucide-react";
import { AppFeature } from "../types";

interface HeroProps {
  onStartGenerating: () => void;
  onUploadImage: () => void;
}

export function Hero({ onStartGenerating, onUploadImage }: HeroProps) {
  return (
    <section className="relative py-20 flex flex-col items-center text-center px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyber-blue/10 blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-bold uppercase tracking-[0.2em] mb-6">
          <Sparkles size={14} />
          Neural Engine V3.0
        </div>
        
        <h2 className="font-display font-extrabold text-6xl md:text-8xl tracking-tighter mb-6 max-w-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-white to-cyber-purple">
          AI THAT THINKS & CREATES FOR YOU
        </h2>
        
        <p className="text-[#e2e8f0]/60 text-lg md:text-xl max-w-2xl mb-12 font-medium">
          Auto Prompt + Auto Image + Smart Editing with <span className="text-cyber-blue neon-text-blue">Face Protection</span>. 
          Experience real-time identity preservation.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={onStartGenerating}
            className="cyber-button cyber-button-primary px-10"
          >
            <span className="flex items-center gap-3">
              GENERATE NOW
              <Sparkles size={18} />
            </span>
          </button>
          
          <button 
            onClick={onUploadImage}
            className="cyber-button cyber-button-outline px-10"
          >
            <span className="flex items-center gap-3">
              SMART EDITOR
              <Upload size={18} />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
