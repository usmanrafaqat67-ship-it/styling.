/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StyleOption = 'Realistic' | 'Anime' | 'Cyberpunk' | '3D';

export interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  style?: StyleOption;
  timestamp: number;
  type: 'generated' | 'edited';
}

export type AppFeature = 'home' | 'generator' | 'editor' | 'gallery' | 'profile';

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}
