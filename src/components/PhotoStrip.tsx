import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Smile, Pencil } from 'lucide-react';
import { StripColorPicker } from './StripColorPicker';
import { StickerPicker } from './StickerPicker';
import { DraggableSticker } from './DraggableSticker';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingTool } from './DrawingTool';
import type { Photo, StripColor, Sticker } from '../App';

interface PhotoStripProps {
  photos: Photo[];
  stripColor: StripColor;
  stickers: Sticker[];
  drawing: string;
  onStripColorChange: (color: StripColor) => void;
  onStickersChange: (stickers: Sticker[]) => void;
  onDrawingChange: (drawing: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PhotoStrip({
  photos,
  stripColor,
  stickers,
  drawing,
  onStripColorChange,
  onStickersChange,
  onDrawingChange,
  onNext,
  onBack
}: PhotoStripProps) {
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString() + Math.random(),
      emoji,
      x: 150,
      y: 150,
      scale: 1,
      rotation: 0
    };
    onStickersChange([...stickers, newSticker]);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    onStickersChange(
      stickers.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  };

  const removeSticker = (id: string) => {
    onStickersChange(stickers.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-6xl w-full">
        <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-gray-800 mb-1">Design Your Photo Strip</h2>
            <p className="text-gray-500">Choose colors and add stickers</p>
          </div>

          <div className="grid lg:grid-cols-[1fr,auto] gap-8">
            {/* Photo Strip Preview */}
            <div className="flex justify-center items-center">
              <div 
                ref={stripRef}
                className="relative"
                style={{ width: '340px' }}
              >
                <div
                  className="relative p-6 border-2 border-gray-900"
                  style={{ 
                    backgroundColor: getStripColorValue(stripColor),
                  }}
                >
                  {/* Watermark */}
                  <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-sm z-10 border border-white">
                    @fondairena
                  </div>

                  <div className="space-y-4">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.dataUrl}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-auto border-2 border-white"
                          style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Stickers Layer */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                      {stickers.map((sticker) => (
                        <DraggableSticker
                          key={sticker.id}
                          sticker={sticker}
                          onUpdate={(updates) => updateSticker(sticker.id, updates)}
                          onRemove={() => removeSticker(sticker.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Drawing Layer */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                      <DrawingCanvas
                        drawing={drawing}
                        onDrawingChange={onDrawingChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Color Picker */}
              <div>
                <h3 className="text-gray-700 mb-3 flex items-center gap-2">
                  Strip Color
                </h3>
                <StripColorPicker
                  selectedColor={stripColor}
                  onColorChange={onStripColorChange}
                />
              </div>

              {/* Sticker Picker */}
              <div>
                <h3 className="text-gray-700 mb-3 flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Add Stickers
                </h3>
                <button
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                  className="w-full bg-purple-400 hover:bg-purple-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {showStickerPicker ? 'Hide Stickers' : 'Show Stickers'}
                </button>
                
                {showStickerPicker && (
                  <div className="mt-3">
                    <StickerPicker onStickerSelect={addSticker} />
                  </div>
                )}
              </div>

              {/* Drawing Tools */}
              <div>
                <h3 className="text-gray-700 mb-3 flex items-center gap-2">
                  <Pencil className="w-5 h-5" />
                  Draw
                </h3>
                <button
                  onClick={() => setShowDrawingTools(!showDrawingTools)}
                  className="w-full bg-purple-400 hover:bg-purple-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {showDrawingTools ? 'Hide Drawing Tools' : 'Show Drawing Tools'}
                </button>
                
                {showDrawingTools && (
                  <div className="mt-3">
                    <DrawingTool
                      width={340}
                      height={600}
                      onDrawingChange={onDrawingChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Add Notes
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStripColorValue(color: StripColor): string {
  const colors = {
    pink: '#FFD6E8',
    lavender: '#E6D6FF',
    mint: '#D6FFE8',
    peach: '#FFE6D6',
    sky: '#D6E8FF',
    lemon: '#FFFFD6',
    rose: '#FFD6D6',
    cream: '#FFF5E6'
  };
  return colors[color];
}