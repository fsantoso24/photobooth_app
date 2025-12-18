interface DrawingCanvasProps {
  drawing: string;
  onDrawingChange: (dataUrl: string) => void;
}

export function DrawingCanvas({ drawing }: DrawingCanvasProps) {
  return drawing ? (
    <img
      src={drawing}
      alt="Drawing"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  ) : null;
}
