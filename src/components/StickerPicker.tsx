interface StickerPickerProps {
  onStickerSelect: (emoji: string) => void;
}

const STICKER_CATEGORIES = {
  'Hearts': ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💘', '🩷', '🩵'],
  'Smileys': ['😊', '🥰', '😍', '🤩', '😘', '😚', '😙', '😗', '🙂', '😇'],
  'Sparkles': ['✨', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '💢', '🌈', '☀️'],
  'Nature': ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🌿', '🍀', '🦋'],
  'Objects': ['💌', '💎', '👑', '🎀', '🎁', '🎈', '🎉', '🎊', '🪩', '🎨'],
  'Food': ['🍓', '🍒', '🍑', '🍋', '🍊', '🍉', '🍰', '🧁', '🍪', '🍩']
};

export function StickerPicker({ onStickerSelect }: StickerPickerProps) {
  return (
    <div className="bg-white border-2 border-gray-900 p-4 max-h-96 overflow-y-auto custom-scrollbar">
      {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
        <div key={category} className="mb-4 last:mb-0">
          <h4 className="text-gray-600 mb-2">{category}</h4>
          <div className="grid grid-cols-5 gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => onStickerSelect(sticker)}
                className="aspect-square flex items-center justify-center text-2xl hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}