import React from 'react';

interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({ notes, onNotesChange }) => {
  const maxLength = 280;
  const remainingChars = maxLength - notes.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="notes" className="text-lg font-semibold text-gray-800">
          Add a note (optional)
        </label>
        <span className={`text-sm ${
          remainingChars < 20 ? 'text-amber-600' : 'text-gray-500'
        }`}>
          {remainingChars} characters left
        </span>
      </div>
      <div className="relative">
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          maxLength={maxLength}
          placeholder="Tell us more about how you're feeling today..."
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
          rows={4}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {notes.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};