
import { Wallpaper, Category } from './types';

export const CATEGORIES: Category[] = ['All', 'Abstract', 'Nature', 'Cyberpunk', 'Space', 'Minimalist'];

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/10/1920/1080',
    prompt: 'Hyper-realistic mountain landscape with 3D depth',
    category: 'Nature',
    aspectRatio: '16:9',
    isAIGenerated: false
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/20/1080/1920',
    prompt: 'Abstract liquid chrome fluid art with neon highlights',
    category: 'Abstract',
    aspectRatio: '9:16',
    isAIGenerated: false
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/30/1920/1080',
    prompt: 'Cyberpunk city street at night, rainy with holograms',
    category: 'Cyberpunk',
    aspectRatio: '16:9',
    isAIGenerated: false
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/40/1920/1080',
    prompt: 'Deep space nebula with swirling 3D gas clouds',
    category: 'Space',
    aspectRatio: '16:9',
    isAIGenerated: false
  }
];

export const PROMPT_ENHANCERS = [
  "high-resolution 4k",
  "octane render",
  "cinematic lighting",
  "deep parallax depth",
  "intricate details",
  "volumetric lighting",
  "3D texture",
  "unreal engine 5"
];
