import React from 'react';
import { emotions } from '../data/emotions';
import { Emotion } from '../types/mood';

interface EmotionSelectorProps {
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: Emotion) => void;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onEmotionSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        How are you feeling today?
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotion === emotion.id;
          return (
            <button
              key={emotion.id}
              onClick={() => onEmotionSelect(emotion)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 transform
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:scale-102 hover:shadow-md'
                }
                ${emotion.hoverColor}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                active:scale-95
              `}
              type="button"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl animate-bounce-subtle">
                  {emotion.icon}
                </span>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {emotion.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};