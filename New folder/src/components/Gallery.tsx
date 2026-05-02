/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Download, Trash2, Filter } from "lucide-react";
import { GalleryImage } from "../types";
import { useState } from "react";

interface GalleryProps {
  images: GalleryImage[];
  onDelete: (id: string) => void;
}

export function Gallery({ images, onDelete }: GalleryProps) {
  const [filter, setFilter] = useState<'all' | 'generated' | 'edited'>('all');

  const filteredImages = images.filter(img => 
    filter === 'all' ? true : img.type === filter
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-display font-bold">Neural Archive</h2>
           <p className="text-white/40 text-sm mt-1">Stored collection of processed visual data.</p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
           {(['all', 'generated', 'edited'] as const).map((mode) => (
             <button
               key={mode}
               onClick={() => setFilter(mode)}
               className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                 filter === mode 
                   ? 'bg-cyber-blue text-black' 
                   : 'text-white/60 hover:text-white hover:bg-white/5'
               }`}
             >
               {mode}
             </button>
           ))}
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center glass-card opacity-40">
           <Filter size={48} className="mb-4" />
           <p className="font-display text-xl">Archive is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <AnimatePresence mode="popLayout">
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="aspect-square relative overflow-hidden">
                     <img 
                       src={img.url} 
                       alt="Saved archive" 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a 
                           href={img.url} 
                           download={`archive-${img.id}.png`}
                           className="w-12 h-12 bg-cyber-blue text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                           <Download size={20} />
                        </a>
                        <button 
                           onClick={() => onDelete(img.id)}
                           className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>

                     <div className="absolute top-2 left-2 flex gap-1">
                        <div className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border ${
                           img.type === 'generated' 
                            ? 'bg-cyber-blue/10 border-cyber-blue text-cyber-blue' 
                            : 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple'
                        }`}>
                           {img.type}
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white/[0.02]">
                     <p className="text-[10px] text-white/40 truncate font-mono">{img.prompt}</p>
                     <p className="text-[9px] text-white/20 mt-2 font-mono">
                        {new Date(img.timestamp).toLocaleString()}
                     </p>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      )}
    </div>
  );
}
