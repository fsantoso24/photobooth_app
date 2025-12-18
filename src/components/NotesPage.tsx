import { useRef } from 'react';
import { ArrowLeft, Download, Share2, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';
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

  const handleDownload = async () => {
    if (!finalResultRef.current) return;

    try {
      const canvas = await html2canvas(finalResultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

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
    if (!finalResultRef.current) return;

    try {
      const canvas = await html2canvas(finalResultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'fondairena-photobooth.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'My Fondairena Photobooth',
              text: 'Check out my photo strip! 📸 Created with @fondairena'
            });
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
      });
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try downloading instead.');
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