import { useRef, useState, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';
import type { Sticker } from '../App';

interface DraggableStickerProps {
  sticker: Sticker;
  onUpdate: (updates: Partial<Sticker>) => void;
  onRemove: () => void;
}

export function DraggableSticker({ sticker, onUpdate, onRemove }: DraggableStickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, stickerX: 0, stickerY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.sticker-control')) {
      return;
    }
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      stickerX: sticker.x,
      stickerY: sticker.y
    };
    e.preventDefault();
  };

  const handleRotate = () => {
    onUpdate({ rotation: (sticker.rotation + 45) % 360 });
  };

  const handleScale = () => {
    const newScale = sticker.scale === 1 ? 1.5 : sticker.scale === 1.5 ? 0.7 : 1;
    onUpdate({ scale: newScale });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      onUpdate({
        x: dragStartPos.current.stickerX + deltaX,
        y: dragStartPos.current.stickerY + deltaY
      });
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onUpdate]);

  return (
    <div
      className="absolute cursor-move select-none"
      style={{
        left: `${sticker.x}px`,
        top: `${sticker.y}px`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && setShowControls(false)}
    >
      <div className="relative">
        <div className="text-4xl pointer-events-none">
          {sticker.emoji}
        </div>
        
        {showControls && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 bg-black/70 rounded-full p-1">
            <button
              onClick={handleRotate}
              className="sticker-control p-1 hover:bg-white/20 rounded-full transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={handleScale}
              className="sticker-control p-1 hover:bg-white/20 rounded-full transition-colors text-white text-xs"
              title="Resize"
            >
              ⇅
            </button>
            <button
              onClick={onRemove}
              className="sticker-control p-1 hover:bg-red-500 rounded-full transition-colors"
              title="Remove"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}