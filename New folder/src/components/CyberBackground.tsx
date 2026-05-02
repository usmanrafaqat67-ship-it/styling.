/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-cyber-dark cyber-grid">
      {/* Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-cyber-blue rounded-full blur-[120px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-cyber-purple rounded-full blur-[120px]"
      />
    </div>
  );
}
