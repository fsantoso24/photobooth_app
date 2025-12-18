import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { PrinterAnimation } from './PrinterAnimation';
import type { Photo } from '../App';

interface CameraCaptureProps {
  onComplete: (photos: Photo[]) => void;
}

export function CameraCapture({ onComplete }: CameraCaptureProps) {
  const [mode, setMode] = useState<'choose' | 'camera' | 'upload' | 'printing'>('choose');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [flash, setFlash] = useState(false);
  const [printingProgress, setPrintingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (mode === 'printing') {
      const interval = setInterval(() => {
        setPrintingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete(photos);
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode, photos, onComplete]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false
      });
      setStream(mediaStream);
      setMode('camera');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && photos.length < 4) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        const newPhoto: Photo = {
          id: Date.now().toString(),
          dataUrl,
          timestamp: Date.now()
        };
        
        setPhotos(prev => [...prev, newPhoto]);
        
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 4 - photos.length);
    
    let processed = 0;
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random(),
            dataUrl: event.target.result as string,
            timestamp: Date.now()
          };
          setPhotos(prev => [...prev, newPhoto]);
          processed++;
          
          if (processed === fileArray.length && mode === 'choose') {
            setMode('upload');
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleComplete = () => {
    if (photos.length > 0) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setMode('printing');
      setPrintingProgress(0);
    }
  };

  if (mode === 'printing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <PrinterAnimation photos={photos} progress={printingProgress} />
      </div>
    );
  }

  if (mode === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-5xl w-full">
          {/* Hand-drawn header */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <h1 className="text-gray-800 mb-0 relative z-10">@fondairena</h1>
              <p className="text-gray-600">Digital Photobooth</p>
              {/* Hand-drawn underline */}
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path 
                  d="M5 8 Q 75 4, 150 6 T 295 7" 
                  stroke="#FFB6C1" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <p className="text-gray-600 mt-4">Create your aesthetic memories ✨</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Camera Option */}
            <button
              onClick={startCamera}
              className="group bg-white p-8 border-2 border-gray-900 relative hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Hand-drawn corner decoration */}
              <div className="absolute top-0 left-0 w-8 h-8">
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M2 2 L30 2 M2 2 L2 30" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rotate-180">
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M2 2 L30 2 M2 2 L2 30" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-pink-200 rotate-3"></div>
                  <div className="absolute inset-0 bg-pink-100 -rotate-3 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-pink-600" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-gray-800 mb-2">Take Photos</h2>
              <p className="text-gray-600">Capture moments with your camera</p>

              <div className="mt-6 flex justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-300 group-hover:scale-125 transition-transform"></div>
                <div className="w-3 h-3 rounded-full bg-purple-300 group-hover:scale-125 transition-transform" style={{ transitionDelay: '50ms' }}></div>
                <div className="w-3 h-3 rounded-full bg-blue-300 group-hover:scale-125 transition-transform" style={{ transitionDelay: '100ms' }}></div>
              </div>
            </button>

            {/* Upload Option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group bg-white p-8 border-2 border-gray-900 relative hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Hand-drawn corner decoration */}
              <div className="absolute top-0 left-0 w-8 h-8">
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M2 2 L30 2 M2 2 L2 30" stroke="#9370DB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rotate-180">
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M2 2 L30 2 M2 2 L2 30" stroke="#9370DB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-purple-200 rotate-3"></div>
                  <div className="absolute inset-0 bg-purple-100 -rotate-3 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-gray-800 mb-2">Upload Photos</h2>
              <p className="text-gray-600">Choose from your gallery</p>

              <div className="mt-6 flex justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-300 group-hover:scale-125 transition-transform"></div>
                <div className="w-3 h-3 rounded-full bg-indigo-300 group-hover:scale-125 transition-transform" style={{ transitionDelay: '50ms' }}></div>
                <div className="w-3 h-3 rounded-full bg-violet-300 group-hover:scale-125 transition-transform" style={{ transitionDelay: '100ms' }}></div>
              </div>
            </button>
          </div>

          {/* Info box with hand-drawn style */}
          <div className="max-w-md mx-auto">
            <div className="bg-yellow-50 border-2 border-yellow-400 p-4 relative">
              {/* Hand-drawn arrow */}
              <svg className="absolute -top-8 left-1/2 -translate-x-1/2" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 5 L20 30 M20 30 L15 25 M20 30 L25 25" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-center text-gray-700">
                <span className="inline-block mr-2">💡</span>
                You can add up to 4 photos for your photo strip
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl w-full">
        <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="mb-4">
            <h2 className="text-gray-800 mb-1">
              {mode === 'camera' ? '📸 Take Your Photos' : '🖼️ Review Your Photos'}
            </h2>
            <p className="text-gray-500">Add up to 4 photos ({photos.length}/4)</p>
          </div>

          {mode === 'camera' && (
            <div className="relative aspect-video bg-gray-900 mb-4 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {flash && (
                <div className="absolute inset-0 bg-white animate-pulse" />
              )}
            </div>
          )}

          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square group">
                  <img
                    src={photo.dataUrl}
                    alt="Captured"
                    className="w-full h-full object-cover border-2 border-gray-200"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {mode === 'camera' && photos.length < 4 && (
              <button
                onClick={capturePhoto}
                className="flex-1 bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Camera className="w-5 h-5 inline mr-2" />
                Capture Photo
              </button>
            )}

            {mode === 'upload' && photos.length < 4 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-purple-400 hover:bg-purple-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Upload More
              </button>
            )}

            {photos.length > 0 && (
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-400 hover:bg-green-500 text-white py-3 px-6 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Continue
              </button>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}