import { useEffect, useState } from 'react';
import type { Photo } from '../App';

interface PrinterAnimationProps {
  photos: Photo[];
  progress: number;
}

export function PrinterAnimation({ photos, progress }: PrinterAnimationProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const photoProgress = progress / 100;
    const index = Math.min(Math.floor(photoProgress * photos.length), photos.length - 1);
    setCurrentPhotoIndex(index);
  }, [progress, photos.length]);

  // Calculate how much of the strip has emerged (0-100%)
  const emergenceProgress = progress;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Fun floating elements */}
      <div className="absolute top-10 left-10 text-3xl animate-pulse">🌟</div>
      <div className="absolute top-20 right-10 text-2xl animate-bounce">💫</div>
      <div className="absolute bottom-20 left-20 text-2xl" style={{ animation: 'bounce 2s infinite' }}>🎨</div>
      <div className="absolute bottom-10 right-20 text-3xl animate-pulse">✨</div>

      <div className="max-w-sm w-full">
        {/* Fun status messages */}
        <div className="text-center mb-6">
          <h2 className="text-gray-800 mb-2">
            {progress < 25 && '📸 Loading your photos...'}
            {progress >= 25 && progress < 50 && '🎨 Adding colors & fun...'}
            {progress >= 50 && progress < 75 && '✨ Sprinkling magic...'}
            {progress >= 75 && progress < 95 && '🎉 Almost there!'}
            {progress >= 95 && '✅ Done!'}
          </h2>
        </div>

        {/* Printer Container */}
        <div className="relative">
          {/* Hand-drawn printer */}
          <svg viewBox="0 0 300 200" className="w-full relative z-10" style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.1))' }}>
            {/* Main printer body */}
            <path
              d="M 40 50 Q 38 48, 40 46 L 260 46 Q 262 48, 260 50 L 260 130 Q 262 132, 260 134 L 40 134 Q 38 132, 40 130 Z"
              fill="#E5E7EB"
              stroke="#1F2937"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Top of printer - slightly wonky */}
            <path
              d="M 42 46 Q 41 44, 43 42 L 257 42 Q 259 44, 257 46 Z"
              fill="#9CA3AF"
              stroke="#1F2937"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Printer front panel */}
            <rect
              x="55"
              y="70"
              width="190"
              height="40"
              rx="3"
              fill="#1F2937"
              stroke="#1F2937"
              strokeWidth="2"
              transform="rotate(0.5 150 90)"
            />

            {/* Screen on printer - cyan glow */}
            <rect
              x="70"
              y="82"
              width="80"
              height="16"
              rx="2"
              fill="#06B6D4"
              stroke="#0E7490"
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* Progress bar on screen */}
            <rect
              x="74"
              y="86"
              width={progress * 0.72}
              height="8"
              rx="1"
              fill="#F0FDFA"
              className="transition-all duration-300"
            />

            {/* Indicator lights - red and green */}
            <circle
              cx="180"
              cy="90"
              r="6"
              fill={progress < 50 ? '#EF4444' : '#7F1D1D'}
              stroke="#1F2937"
              strokeWidth="1.5"
            >
              {progress < 50 && (
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              )}
            </circle>

            <circle
              cx="205"
              cy="90"
              r="6"
              fill={progress >= 50 ? '#10B981' : '#064E3B'}
              stroke="#1F2937"
              strokeWidth="1.5"
            >
              {progress >= 50 && (
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              )}
            </circle>

            {/* Paper output slot - where photo comes out */}
            <path
              d="M 60 134 Q 58 136, 60 138 L 240 138 Q 242 136, 240 134 Z"
              fill="#374151"
              stroke="#1F2937"
              strokeWidth="2"
            />

            {/* Little decorative screws */}
            <circle cx="50" cy="60" r="2.5" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="250" cy="60" r="2.5" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="50" cy="120" r="2.5" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="250" cy="120" r="2.5" fill="#6B7280" stroke="#374151" strokeWidth="1" />

            {/* Fun doodles */}
            <path
              d="M 25 70 Q 20 75, 25 80"
              stroke="#F472B6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 275 70 Q 280 75, 275 80"
              stroke="#A78BFA"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Stars decoration */}
            <text x="27" y="67" fontSize="12">✨</text>
            <text x="268" y="67" fontSize="12">✨</text>
          </svg>

          {/* Photo strip emerging from the slot */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 overflow-hidden" style={{ height: '400px' }}>
            <div 
              className="relative transition-all duration-300 ease-out"
              style={{ 
                width: '160px',
                transform: `translateY(${-100 + emergenceProgress}%)`,
              }}
            >
              {/* Photo Strip with straight edges */}
              <div className="relative bg-pink-200 p-2.5 shadow-2xl border-2 border-gray-200">
                {/* Watermark */}
                <div className="absolute top-1 right-1 bg-black text-white px-1.5 py-0.5 border border-white z-10" style={{ fontSize: '9px' }}>
                  @fondairena
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  {photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="relative overflow-hidden border-2 border-white"
                      style={{
                        opacity: index <= currentPhotoIndex ? 1 : 0.3,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto"
                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                      />
                      {/* Scanning line effect on current photo being printed */}
                      {index === currentPhotoIndex && progress < 100 && (
                        <div className="absolute inset-0">
                          <div className="absolute inset-x-0 h-1 bg-white/60 animate-pulse" 
                               style={{ 
                                 top: `${(progress % 25) * 4}%`,
                                 boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                               }} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress info with hand-drawn style */}
        <div className="mt-8 text-center relative z-20">
          <div className="inline-block bg-white border-2 border-gray-900 p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-400 border-2 border-gray-900 rotate-45"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 border-2 border-gray-900 rotate-45"></div>
            
            <p className="text-gray-700 mb-3">{Math.round(progress)}% Complete</p>
            
            <div className="bg-gray-200 h-3 overflow-hidden w-56 border-2 border-gray-900 relative">
              <div 
                className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 h-full transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Fun loading dots */}
            <div className="flex justify-center gap-2 mt-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
