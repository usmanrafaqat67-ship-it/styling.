/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AIGenerator } from "./components/AIGenerator";
import { SmartEditor } from "./components/SmartEditor";
import { Gallery } from "./components/Gallery";
import { CyberBackground } from "./components/CyberBackground";
import { AppFeature, GalleryImage, UserProfile } from "./types";

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('usman_user_profile');
    return saved ? JSON.parse(saved) : {
      name: "Usman Rafaqat",
      role: "AI Creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    };
  });

  const [activeFeature, setActiveFeature] = useState<AppFeature>('home');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('archive_images');
    const initial = saved ? JSON.parse(saved) : [];
    if (initial.length === 0) {
      return [{
        id: 'initial-item',
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
        prompt: "Neural Identity Base Scan",
        timestamp: Date.now(),
        type: 'edited'
      }];
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('archive_images', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem('usman_user_profile', JSON.stringify(user));
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUser(prev => ({ ...prev, avatar: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToArchive = (image: GalleryImage) => {
    setGalleryImages(prev => [image, ...prev]);
    setActiveFeature('gallery');
  };

  const handleDeleteFromArchive = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const renderContent = () => {
    switch (activeFeature) {
      case 'home':
        return <Hero 
          onStartGenerating={() => setActiveFeature('generator')} 
          onUploadImage={() => setActiveFeature('editor')} 
        />;
      case 'generator':
        return <AIGenerator onSaveToGallery={handleSaveToArchive} />;
      case 'editor':
        return <SmartEditor onSaveToGallery={handleSaveToArchive} />;
      case 'gallery':
        return <Gallery images={galleryImages} onDelete={handleDeleteFromArchive} />;
      case 'profile':
        return (
          <div className="max-w-xl mx-auto p-12 text-center">
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 relative">
                <div className="relative group mx-auto mb-6 w-32 h-32">
                   <img src={user.avatar} className="w-full h-full rounded-full object-cover border-2 border-cyber-blue neon-glow-blue" alt={user.name} />
                   <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Update</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                   </label>
                </div>
                <h2 className="text-3xl font-display font-bold">{user.name}</h2>
                <p className="text-cyber-blue font-bold tracking-widest uppercase mb-8">{user.role}</p>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] uppercase text-white/40 mb-1">Generated</p>
                      <p className="text-2xl font-display">{galleryImages.filter(i => i.type === 'generated').length}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] uppercase text-white/40 mb-1">Edited</p>
                      <p className="text-2xl font-display">{galleryImages.filter(i => i.type === 'edited').length}</p>
                   </div>
                </div>
             </motion.div>
          </div>
        );
      default:
        return <Hero onStartGenerating={() => setActiveFeature('generator')} onUploadImage={() => setActiveFeature('editor')} />;
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white">
      <CyberBackground />
      <Header activeFeature={activeFeature} setActiveFeature={setActiveFeature} user={user} />
      
      <main className="relative z-10 pt-10 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-6 text-center z-50 pointer-events-none">
         <div className="inline-block px-6 py-2 glass-card rounded-full border-white/10 text-[10px] text-white/40 uppercase tracking-[0.2em] pointer-events-auto backdrop-blur-md">
            © 2026 Usman AI Studio Pro | <span className="text-cyber-blue font-bold">Built with AI Intelligence</span>
         </div>
      </footer>
    </div>
  );
}
