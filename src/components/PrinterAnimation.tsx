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

  const printedHeight = (progress / 100) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-md w-full">
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

        {/* Hand-drawn printer */}
        <div className="relative">
          {/* Printer body - hand drawn style */}
          <svg viewBox="0 0 400 350" className="w-full" style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.1))' }}>
            {/* Main printer body */}
            <path
              d="M 50 80 Q 48 78, 50 76 L 350 76 Q 352 78, 350 80 L 350 180 Q 352 182, 350 184 L 50 184 Q 48 182, 50 180 Z"
              fill="#E5E7EB"
              stroke="#1F2937"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Top of printer - slightly wonky */}
            <path
              d="M 55 76 Q 54 74, 56 72 L 344 72 Q 346 74, 344 76 Z"
              fill="#9CA3AF"
              stroke="#1F2937"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Printer front panel */}
            <rect
              x="70"
              y="110"
              width="260"
              height="50"
              rx="4"
              fill="#1F2937"
              stroke="#1F2937"
              strokeWidth="2"
              transform="rotate(0.5 200 135)"
            />

            {/* Screen on printer - cyan glow */}
            <rect
              x="90"
              y="125"
              width="100"
              height="20"
              rx="3"
              fill="#06B6D4"
              stroke="#0E7490"
              strokeWidth="2"
              opacity="0.9"
            />

            {/* Progress bar on screen */}
            <rect
              x="95"
              y="130"
              width={progress * 0.9}
              height="10"
              rx="2"
              fill="#F0FDFA"
              className="transition-all duration-300"
            />

            {/* Indicator lights - red and green */}
            <circle
              cx="250"
              cy="135"
              r="8"
              fill={progress < 50 ? '#EF4444' : '#7F1D1D'}
              stroke="#1F2937"
              strokeWidth="2"
            >
              {progress < 50 && (
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              )}
            </circle>

            <circle
              cx="280"
              cy="135"
              r="8"
              fill={progress >= 50 ? '#10B981' : '#064E3B'}
              stroke="#1F2937"
              strokeWidth="2"
            >
              {progress >= 50 && (
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              )}
            </circle>

            {/* Paper slot - hand drawn */}
            <path
              d="M 80 184 Q 78 186, 80 188 L 320 188 Q 322 186, 320 184 Z"
              fill="#374151"
              stroke="#1F2937"
              strokeWidth="2.5"
            />

            {/* Little decorative screws */}
            <circle cx="65" cy="90" r="3" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="335" cy="90" r="3" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="65" cy="170" r="3" fill="#6B7280" stroke="#374151" strokeWidth="1" />
            <circle cx="335" cy="170" r="3" fill="#6B7280" stroke="#374151" strokeWidth="1" />

            {/* Fun doodles */}
            <path
              d="M 30 100 Q 25 105, 30 110"
              stroke="#F472B6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 370 100 Q 375 105, 370 110"
              stroke="#A78BFA"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Stars decoration */}
            <text x="35" y="95" fontSize="16">✨</text>
            <text x="360" y="95" fontSize="16">✨</text>
          </svg>

          {/* Photo strip coming out - positioned below printer */}
          <div className="relative -mt-4 flex justify-center">
            <div 
              className="relative transition-all duration-300 ease-out"
              style={{ 
                width: '200px',
                transform: `translateY(${-100 + printedHeight}%)`,
              }}
            >
              {/* Photo Strip with hand-drawn border */}
              <div className="relative bg-pink-200 p-3 shadow-xl" style={{ 
                clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)',
              }}>
                {/* Watermark */}
                <div className="absolute top-1 right-1 bg-black text-white px-2 py-0.5 text-xs border border-white z-10">
                  @fondairena
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  {photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="relative overflow-hidden border-2 border-white"
                      style={{
                        opacity: index <= currentPhotoIndex ? 1 : 0.2,
                      }}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto"
                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                      />
                      {/* Scanning line effect */}
                      {index === currentPhotoIndex && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress info with hand-drawn style */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white border-2 border-gray-900 p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Decorative corner */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-400 border-2 border-gray-900 rotate-45"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 border-2 border-gray-900 rotate-45"></div>
            
            <p className="text-gray-700 mb-3 font-medium">{Math.round(progress)}% Complete</p>
            
            <div className="bg-gray-200 h-4 overflow-hidden w-64 border-2 border-gray-900 relative">
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

        {/* Fun doodles around */}
        <div className="absolute top-10 left-10 text-4xl animate-pulse">🌟</div>
        <div className="absolute top-20 right-10 text-3xl animate-bounce">💫</div>
        <div className="absolute bottom-20 left-20 text-3xl" style={{ animation: 'bounce 2s infinite' }}>🎨</div>
        <div className="absolute bottom-10 right-20 text-4xl animate-pulse">✨</div>
      </div>
    </div>
  );
}
