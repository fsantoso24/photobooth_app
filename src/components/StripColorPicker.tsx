import { Check } from 'lucide-react';
import type { StripColor } from '../App';

interface StripColorPickerProps {
  selectedColor: StripColor;
  onColorChange: (color: StripColor) => void;
}

const STRIP_COLORS: { name: StripColor; value: string; label: string }[] = [
  { name: 'pink', value: '#FFD6E8', label: 'Pink' },
  { name: 'lavender', value: '#E6D6FF', label: 'Lavender' },
  { name: 'mint', value: '#D6FFE8', label: 'Mint' },
  { name: 'peach', value: '#FFE6D6', label: 'Peach' },
  { name: 'sky', value: '#D6E8FF', label: 'Sky' },
  { name: 'lemon', value: '#FFFFD6', label: 'Lemon' },
  { name: 'rose', value: '#FFD6D6', label: 'Rose' },
  { name: 'cream', value: '#FFF5E6', label: 'Cream' }
];

export function StripColorPicker({ selectedColor, onColorChange }: StripColorPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {STRIP_COLORS.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorChange(color.name)}
          className={`relative aspect-square border-2 border-gray-900 transition-all hover:scale-105 ${
            selectedColor === color.name ? 'ring-4 ring-pink-500 ring-offset-2' : ''
          }`}
          style={{ backgroundColor: color.value }}
          title={color.label}
        >
          {selectedColor === color.name && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-6 h-6 text-gray-700" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}