/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Home, Sparkles, Edit3, Image as ImageIcon, User, LogOut } from "lucide-react";
import { AppFeature, UserProfile } from "../types";
import { motion } from "motion/react";

interface HeaderProps {
  activeFeature: AppFeature;
  setActiveFeature: (feature: AppFeature) => void;
  user: UserProfile;
}

export function Header({ activeFeature, setActiveFeature, user }: HeaderProps) {
  const navItems: { id: AppFeature; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'gallery', label: 'Archive', icon: ImageIcon },
  ];

  return (
    <header className="h-16 glass-card rounded-b-2xl border-x-0 border-t-0 border-b-white/5 flex items-center justify-between px-8 mb-4 z-50 sticky top-0">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setActiveFeature('home')}
      >
        <div className="w-10 h-10 flex items-center justify-center border-2 border-cyber-blue rotate-45 rounded-lg shadow-[0_0_15px_rgba(0,242,255,0.4)] group-hover:scale-110 transition-transform">
          <Shield className="-rotate-45 text-cyber-blue" size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter sm:block hidden bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-cyber-purple">
          USMAN AI STUDIO PRO
        </h1>
      </div>

      <nav className="hidden md:flex gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFeature(item.id)}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
              activeFeature === item.id 
                ? 'text-cyber-blue neon-text-blue' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full border border-white/20 overflow-hidden"
            onClick={() => setActiveFeature('profile')}
          >
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-full h-full object-cover cursor-pointer"
            />
          </motion.div>
          <div className="flex flex-col text-right sm:block hidden">
            <span className="text-[10px] font-bold block">{user.name}</span>
            <span className="text-[8px] opacity-40 block">AI CREATOR • PRO</span>
          </div>
        </div>
      </div>
    </header>
  );
}
