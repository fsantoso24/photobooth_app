import { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, Undo } from 'lucide-react';

export type DrawingToolType = 'pencil' | 'pen' | 'marker';
export type DrawingColor = 'black' | 'red' | 'blue' | 'pink' | 'purple' | 'green';

interface DrawingToolProps {
  width: number;
  height: number;
  onDrawingChange: (dataUrl: string) => void;
}

interface DrawingLine {
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
}

export function DrawingTool({ width, height, onDrawingChange }: DrawingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingToolType>('pen');
  const [currentColor, setCurrentColor] = useState<DrawingColor>('black');
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([]);

  const tools: { name: DrawingToolType; width: number; label: string }[] = [
    { name: 'pencil', width: 2, label: '✏️ Pencil' },
    { name: 'pen', width: 3, label: '🖊️ Pen' },
    { name: 'marker', width: 8, label: '🖍️ Marker' }
  ];

  const colors: { name: DrawingColor; value: string }[] = [
    { name: 'black', value: '#000000' },
    { name: 'red', value: '#EF4444' },
    { name: 'blue', value: '#3B82F6' },
    { name: 'pink', value: '#EC4899' },
    { name: 'purple', value: '#A855F7' },
    { name: 'green', value: '#10B981' }
  ];

  const getLineWidth = () => {
    const tool = tools.find(t => t.name === currentTool);
    return tool?.width || 3;
  };

  const getColorValue = () => {
    const color = colors.find(c => c.name === currentColor);
    return color?.value || '#000000';
  };

  useEffect(() => {
    redraw();
  }, [lines]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    lines.forEach(line => {
      if (line.points.length < 2) return;

      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);

      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }

      ctx.stroke();
    });

    // Only update parent when we have actual drawings
    if (lines.length > 0 && canvas) {
      onDrawingChange(canvas.toDataURL());
    } else if (lines.length === 0) {
      onDrawingChange('');
    }
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getCoordinates(e);
    setIsDrawing(true);
    setCurrentLine([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const point = getCoordinates(e);
    const newLine = [...currentLine, point];
    setCurrentLine(newLine);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.strokeStyle = getColorValue();
    ctx.lineWidth = getLineWidth();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentLine.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentLine[currentLine.length - 1].x, currentLine[currentLine.length - 1].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (isDrawing && currentLine.length > 0) {
      setLines([...lines, {
        points: currentLine,
        color: getColorValue(),
        lineWidth: getLineWidth()
      }]);
      setCurrentLine([]);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setLines([]);
    setCurrentLine([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, width, height);
      onDrawingChange('');
    }
  };

  const undo = () => {
    if (lines.length > 0) {
      setLines(lines.slice(0, -1));
    }
  };

  return (
    <div className="bg-white border-2 border-gray-900 p-4">
      <div className="mb-3">
        <h4 className="text-gray-700 mb-2">Drawing Tools</h4>
        
        {/* Tool Selection */}
        <div className="flex gap-2 mb-3">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setCurrentTool(tool.name)}
              className={`px-3 py-2 border-2 border-gray-900 transition-all text-sm ${
                currentTool === tool.name
                  ? 'bg-purple-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:translate-x-0.5 hover:translate-y-0.5'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Color Selection */}
        <div className="flex gap-2 mb-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setCurrentColor(color.name)}
              className={`w-8 h-8 border-2 border-gray-900 transition-all ${
                currentColor === color.name ? 'ring-2 ring-purple-500 ring-offset-2' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={undo}
            disabled={lines.length === 0}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Undo className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={clearCanvas}
            disabled={lines.length === 0}
            className="flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 border-2 border-gray-900 hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Eraser className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="border-2 border-gray-300 bg-white/50 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="cursor-crosshair touch-none"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">Draw directly on the canvas above</p>
    </div>
  );
}