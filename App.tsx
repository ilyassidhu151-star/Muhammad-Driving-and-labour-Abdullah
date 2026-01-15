
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { WallpaperCard } from './components/WallpaperCard';
import { PreviewModal } from './components/PreviewModal';
import { geminiService } from './services/geminiService';
import { Wallpaper, Category, GenerationState } from './types';
import { INITIAL_WALLPAPERS, CATEGORIES, PROMPT_ENHANCERS } from './constants';
import { Sparkles, Plus, Search, Filter, Loader2, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewing, setPreviewing] = useState<Wallpaper | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [generation, setGeneration] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    progressMessage: ''
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGeneration({ 
      isGenerating: true, 
      error: null, 
      progressMessage: 'Connecting to Gemini AI...' 
    });

    try {
      const messages = [
        'Connecting to Gemini AI...',
        'Synthesizing 3D textures...',
        'Calculating depth maps...',
        'Rendering volumetric lighting...',
        'Polishing final pixels...'
      ];
      
      let msgIndex = 0;
      const interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setGeneration(prev => ({ ...prev, progressMessage: messages[msgIndex] }));
      }, 2000);

      // Enhance prompt for better results
      const enhancedPrompt = `${prompt}, ${PROMPT_ENHANCERS.join(', ')}`;
      const imageUrl = await geminiService.generateWallpaper(enhancedPrompt, aspectRatio);
      
      clearInterval(interval);

      const newWallpaper: Wallpaper = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        category: 'Abstract', // Default category for generated
        aspectRatio: aspectRatio,
        isAIGenerated: true
      };

      setWallpapers(prev => [newWallpaper, ...prev]);
      setPrompt('');
      setGeneration({ isGenerating: false, error: null, progressMessage: '' });
    } catch (error) {
      setGeneration({ 
        isGenerating: false, 
        error: 'Failed to generate wallpaper. Please try again.', 
        progressMessage: '' 
      });
    }
  };

  const filteredWallpapers = wallpapers.filter(w => {
    const matchesCategory = activeCategory === 'All' || w.category === activeCategory;
    const matchesSearch = w.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 sm:text-5xl">
            Dimension3D
          </h1>
          <p className="mt-2 text-slate-400 max-w-md">
            The next generation of AI-powered 3D wallpapers. Generate immersive visuals in seconds.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all w-64"
            />
          </div>
        </div>
      </header>

      {/* Generator Section */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mb-12 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold">Custom Generator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <textarea 
              placeholder="Describe your 3D wallpaper dream... (e.g., 'Floating crystalline structures in a bioluminescent forest')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {['Cyberpunk', 'Crystal', 'Neon', 'Hyper-realistic', 'Fractal', 'Minimalist'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setPrompt(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Format</label>
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                {(['16:9', '1:1', '9:16'] as const).map(ratio => (
                  <button 
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${aspectRatio === ratio ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={generation.isGenerating || !prompt.trim()}
              onClick={handleGenerate}
              className={`mt-auto w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                generation.isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
              }`}
            >
              {generation.isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{generation.progressMessage}</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>Generate Wallpapers</span>
                </>
              )}
            </button>
          </div>
        </div>

        {generation.error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <span className="font-bold underline">Error:</span> {generation.error}
          </div>
        )}
      </section>

      {/* Gallery Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Filter size={18} className="text-slate-500 mr-2" />
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat 
                ? 'bg-white text-black' 
                : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWallpapers.length > 0 ? (
          filteredWallpapers.map(wp => (
            <WallpaperCard 
              key={wp.id} 
              wallpaper={wp} 
              onPreview={setPreviewing}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
               <Search size={32} />
            </div>
            <p className="text-lg">No wallpapers found matching your search.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-4 text-purple-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg" />
          <span className="font-bold text-lg">Dimension3D</span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Dimension3D AI Studio. Powered by Gemini.
        </p>
      </footer>

      {/* Modals */}
      {previewing && (
        <PreviewModal 
          wallpaper={previewing} 
          onClose={() => setPreviewing(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
