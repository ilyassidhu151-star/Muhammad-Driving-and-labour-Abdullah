
import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { Maximize2, Download, Sparkles } from 'lucide-react';

interface Props {
  wallpaper: Wallpaper;
  onPreview: (w: Wallpaper) => void;
}

export const WallpaperCard: React.FC<Props> = ({ wallpaper, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotate({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = wallpaper.url;
    link.download = `wallpaper-${wallpaper.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out"
      style={{
        perspective: '1000px',
        transform: isHovered 
          ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(139, 92, 246, 0.25)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPreview(wallpaper)}
    >
      <div className="aspect-[4/3] relative">
        <img 
          src={wallpaper.url} 
          alt={wallpaper.prompt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <p className="text-xs font-medium text-purple-300 uppercase tracking-widest flex items-center gap-1">
              {wallpaper.isAIGenerated && <Sparkles size={12} />}
              {wallpaper.category}
            </p>
            <p className="text-sm font-semibold line-clamp-1">{wallpaper.prompt}</p>
            <div className="flex items-center gap-2 pt-2">
              <button 
                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                onClick={(e) => { e.stopPropagation(); onPreview(wallpaper); }}
              >
                <Maximize2 size={14} /> Preview
              </button>
              <button 
                className="w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center transition-colors"
                onClick={handleDownload}
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>

        {wallpaper.isAIGenerated && (
          <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            AI Generated
          </div>
        )}
      </div>
    </div>
  );
};
