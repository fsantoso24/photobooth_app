import { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { PhotoStrip } from './components/PhotoStrip';
import { NotesPage } from './components/NotesPage';

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type StripColor = 'pink' | 'lavender' | 'mint' | 'peach' | 'sky' | 'lemon' | 'rose' | 'cream';

export default function App() {
  const [step, setStep] = useState<'capture' | 'strip' | 'notes'>('capture');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stripColor, setStripColor] = useState<StripColor>('pink');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [notes, setNotes] = useState('');
  const [drawing, setDrawing] = useState('');

  const handlePhotosCapture = (capturedPhotos: Photo[]) => {
    setPhotos(capturedPhotos);
    setStep('strip');
  };

  const handleReset = () => {
    setPhotos([]);
    setStickers([]);
    setNotes('');
    setDrawing('');
    setStep('capture');
  };

  const handleBackToCapture = () => {
    setStep('capture');
  };

  return (
    <div className="min-h-screen bg-white">
      {step === 'capture' && (
        <CameraCapture onComplete={handlePhotosCapture} />
      )}
      
      {step === 'strip' && (
        <PhotoStrip
          photos={photos}
          stripColor={stripColor}
          stickers={stickers}
          drawing={drawing}
          onStripColorChange={setStripColor}
          onStickersChange={setStickers}
          onDrawingChange={setDrawing}
          onNext={() => setStep('notes')}
          onBack={handleBackToCapture}
        />
      )}
      
      {step === 'notes' && (
        <NotesPage
          photos={photos}
          stripColor={stripColor}
          stickers={stickers}
          drawing={drawing}
          notes={notes}
          onNotesChange={setNotes}
          onBack={() => setStep('strip')}
          onReset={handleReset}
        />
      )}
    </div>
  );
}