
export interface Wallpaper {
  id: string;
  url: string;
  prompt: string;
  category: Category;
  aspectRatio: '1:1' | '16:9' | '9:16';
  isAIGenerated: boolean;
}

export type Category = 'Abstract' | 'Cyberpunk' | 'Nature' | 'Minimalist' | 'Space' | 'All';

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  progressMessage: string;
}
