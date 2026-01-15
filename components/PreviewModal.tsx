
import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface Props {
  wallpaper: Wallpaper;
  onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ wallpaper, onClose }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setParallax({ x, y });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = wallpaper.url;
    link.download = `wallpaper-${wallpaper.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl transition-all animate-in fade-in duration-300"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">Preview</h2>
          <p className="text-sm text-gray-400 max-w-md truncate">{wallpaper.prompt}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/10 p-1 rounded-xl">
            <button 
              className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setViewMode('desktop')}
            >
              <Monitor size={20} />
            </button>
            <button 
              className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone size={20} />
            </button>
          </div>
          <button 
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            onClick={handleDownload}
          >
            <Download size={18} /> Download
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Mockup Container */}
          <div 
            className={`transition-all duration-700 ease-out flex items-center justify-center`}
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`
            }}
          >
            {viewMode === 'desktop' ? (
              <div className="relative w-[80vw] max-w-5xl aspect-video rounded-2xl overflow-hidden border-[12px] border-gray-800 shadow-2xl">
                <img 
                  src={wallpaper.url} 
                  alt="Desktop Preview" 
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(1.1) translate(${parallax.x * -0.2}px, ${parallax.y * -0.2}px)`
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-md flex items-center justify-center gap-8 px-6">
                   <div className="w-8 h-8 rounded bg-white/10" />
                   <div className="w-8 h-8 rounded bg-white/10" />
                   <div className="w-8 h-8 rounded bg-white/10" />
                </div>
              </div>
            ) : (
              <div className="relative w-[320px] h-[650px] rounded-[3rem] overflow-hidden border-[10px] border-gray-900 shadow-2xl ring-4 ring-gray-800">
                <img 
                  src={wallpaper.url} 
                  alt="Mobile Preview" 
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(1.2) translate(${parallax.x * -0.5}px, ${parallax.y * -0.5}px)`
                  }}
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6 px-8">
                   <div className="text-white text-5xl font-light">12:45</div>
                   <div className="text-white/80 text-sm">Friday, June 20</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
