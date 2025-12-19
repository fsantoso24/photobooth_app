import { useRef } from 'react';
import { ArrowLeft, Download, Share2, RotateCcw } from 'lucide-react';
import type { Photo, StripColor, Sticker } from '../App';

interface NotesPageProps {
  photos: Photo[];
  stripColor: StripColor;
  stickers: Sticker[];
  drawing: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onReset: () => void;
}

export function NotesPage({
  photos,
  stripColor,
  stickers,
  drawing,
  notes,
  onNotesChange,
  onBack,
  onReset
}: NotesPageProps) {
  const finalResultRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCanvas = async (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size (420px width from the div + padding)
      const stripWidth = 340; // 420 - (2 * 40 padding)
      const stripPadding = 24; // 6 * 4px
      const photoSpacing = 16; // 4 * 4px
      const photoHeight = (stripWidth - (2 * stripPadding)) * 0.75; // 4:3 aspect ratio
      const borderWidth = 2;
      
      const totalStripHeight = (2 * stripPadding) + (4 * photoHeight) + (3 * photoSpacing) + (2 * borderWidth);
      const notesHeight = 120;
      const notesPadding = 24;
      const spacing = 24;
      
      canvas.width = 420 * 2; // 2x for better quality
      canvas.height = (40 + totalStripHeight + spacing + notesHeight + 40 + 30) * 2; // 2x for better quality
      
      ctx.scale(2, 2);
      
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      let currentY = 40;
      
      // Photo strip background
      ctx.fillStyle = getStripColorValue(stripColor);
      ctx.fillRect(40, currentY, stripWidth, totalStripHeight);
      
      // Photo strip border
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(40, currentY, stripWidth, totalStripHeight);
      
      // Watermark (top right)
      ctx.fillStyle = '#000000';
      ctx.fillRect(40 + stripWidth - 90, currentY + 12, 78, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(40 + stripWidth - 90, currentY + 12, 78, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('@fondairena', 40 + stripWidth - 51, currentY + 28);
      
      const stripStartY = currentY;
      let photoY = currentY + stripPadding;
      
      // Load and draw all images
      const imagePromises: Promise<void>[] = [];
      
      photos.forEach((photo, index) => {
        const promise = new Promise<void>((resolveImg) => {
          const img = new Image();
          img.onload = () => {
            const photoWidth = stripWidth - (2 * stripPadding);
            const photoHeight = photoWidth * 0.75;
            const photoX = 40 + stripPadding;
            const y = photoY + (index * (photoHeight + photoSpacing));
            
            // Draw photo
            ctx.drawImage(img, photoX, y, photoWidth, photoHeight);
            
            // Photo border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(photoX, y, photoWidth, photoHeight);
            
            resolveImg();
          };
          img.onerror = () => resolveImg();
          img.src = photo.dataUrl;
        });
        imagePromises.push(promise);
      });
      
      // Draw stickers
      stickers.forEach((sticker) => {
        ctx.save();
        const stickerX = 40 + sticker.x;
        const stickerY = stripStartY + sticker.y;
        ctx.translate(stickerX, stickerY);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        ctx.scale(sticker.scale, sticker.scale);
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);
        ctx.restore();
      });
      
      // Draw drawing if exists
      if (drawing) {
        const drawPromise = new Promise<void>((resolveDrawing) => {
          const drawImg = new Image();
          drawImg.onload = () => {
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(drawImg, 40, stripStartY, stripWidth, totalStripHeight);
            ctx.globalCompositeOperation = 'source-over';
            resolveDrawing();
          };
          drawImg.onerror = () => resolveDrawing();
          drawImg.src = drawing;
        });
        imagePromises.push(drawPromise);
      }
      
      Promise.all(imagePromises).then(() => {
        currentY += totalStripHeight + spacing;
        
        // Notes section
        ctx.fillStyle = '#FEF3C7';
        ctx.fillRect(40, currentY, stripWidth, notesHeight);
        
        // Notes border
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, currentY, stripWidth, notesHeight);
        
        // Notes label
        ctx.fillStyle = '#FDE68A';
        ctx.fillRect(54, currentY - 12, 60, 24);
        ctx.strokeStyle = '#FBBF24';
        ctx.strokeRect(54, currentY - 12, 60, 24);
        ctx.fillStyle = '#92400E';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Notes', 84, currentY + 3);
        
        // Notes text
        if (notes) {
          ctx.fillStyle = '#374151';
          ctx.font = '14px Arial';
          ctx.textAlign = 'left';
          const maxWidth = stripWidth - (2 * notesPadding);
          const lineHeight = 20;
          const words = notes.split(' ');
          let line = '';
          let y = currentY + notesPadding + 8;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
              ctx.fillText(line, 40 + notesPadding, y);
              line = words[i] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 40 + notesPadding, y);
        }
        
        // Bottom watermark
        currentY += notesHeight + 16;
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('@fondairena', 40 + stripWidth / 2, currentY);
        
        resolve(canvas);
      });
    });
  };

  const handleDownload = async () => {
    try {
      const canvas = await generateCanvas();
      const link = document.createElement('a');
      link.download = `fondairena-photobooth-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      const canvas = await generateCanvas();
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Failed to generate image.');
          return;
        }

        const file = new File([blob], 'fondairena-photobooth.png', { type: 'image/png' });

        if (navigator.share) {
          try {
            // Check if files can be shared
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'My Fondairena Photobooth',
                text: 'Check out my photo strip! 📸 Created with @fondairena'
              });
            } else {
              // Fallback: share without file
              await navigator.share({
                title: 'My Fondairena Photobooth',
                text: 'Check out my photo strip! 📸 Created with @fondairena'
              });
              // Still download the file
              handleDownload();
            }
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              console.error('Error sharing:', err);
              handleDownload();
            }
          }
        } else {
          alert('Sharing not supported on this device. Downloading instead!');
          handleDownload();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Downloading instead...');
      handleDownload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl w-full">
        <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-gray-800 mb-1">Final Result</h2>
            <p className="text-gray-500">Add your notes and share your memories</p>
          </div>

          {/* Final Result Preview */}
          <div className="flex justify-center mb-6">
            <div 
              ref={finalResultRef}
              className="bg-white p-8"
              style={{ width: '420px' }}
            >
              {/* Photo Strip - NO ROUNDED EDGES */}
              <div
                className="p-6 border-2 border-gray-900 mb-6 relative"
                style={{ backgroundColor: getStripColorValue(stripColor) }}
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
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>

                {/* Stickers */}
                <div className="absolute inset-0 pointer-events-none">
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className="absolute"
                      style={{
                        left: `${sticker.x}px`,
                        top: `${sticker.y}px`,
                        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                        fontSize: '2rem'
                      }}
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                </div>

                {/* Drawing */}
                {drawing && (
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src={drawing}
                      alt="Drawing"
                      className="w-full h-full"
                      style={{ mixBlendMode: 'multiply' }}
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div className="bg-yellow-50 p-6 border-2 border-yellow-400 relative">
                <div className="absolute -top-3 left-4 bg-yellow-200 px-3 py-1 text-sm text-yellow-800 border border-yellow-400">
                  Notes
                </div>
                {notes ? (
                  <p className="text-gray-700 whitespace-pre-wrap pt-2">{notes}</p>
                ) : (
                  <p className="text-gray-400 italic pt-2">Add your notes below...</p>
                )}
              </div>

              {/* Bottom Watermark */}
              <div className="text-center mt-4 text-gray-400 text-sm">
                @fondairena
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Add Your Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Write something about these memories... 💭"
              className="w-full h-32 p-4 border-2 border-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              maxLength={300}
            />
            <p className="text-sm text-gray-400 mt-1">
              {notes.length}/300 characters
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />
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
