'use client'
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Emotion } from '../types/mood';
import { submitMoodCheckIn, ApiError } from '../services/api';

interface EmotionRatingProps {
  emotion: Emotion;
  notes: string;
  onSubmit: (intensity: number) => void;
  onBack: () => void;
}

export const EmotionRating: React.FC<EmotionRatingProps> = ({
  emotion,
  notes,
  onSubmit,
  onBack,
}) => {
  const [selectedIntensity, setSelectedIntensity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const intensityLabels = [
    { value: 1, label: 'Very Low', description: 'Barely noticeable', color: 'bg-gray-200' },
    { value: 2, label: 'Low', description: 'Mild feeling', color: 'bg-blue-200' },
    { value: 3, label: 'Moderate', description: 'Noticeable', color: 'bg-blue-300' },
    { value: 4, label: 'High', description: 'Strong feeling', color: 'bg-blue-400' },
    { value: 5, label: 'Very High', description: 'Intense feeling', color: 'bg-blue-500' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const payload = {
        emotion: emotion.name,
        notes: notes.trim(),
        timestamp: new Date().toISOString(),
      };

      const response = await submitMoodCheckIn(payload);
      console.log('Mood check-in submitted successfully:', response);
      
      setSubmitStatus('success');
      
      // Wait a moment to show success message, then proceed
      setTimeout(() => {
        onSubmit(selectedIntensity);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to submit mood check-in:', error);
      
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to submit. Please try again.');
      }
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
    handleSubmit();
  };

  const getIntensityColor = (value: number) => {
    const colors = [
      'bg-gray-200 border-gray-300',
      'bg-blue-200 border-blue-300',
      'bg-blue-300 border-blue-400',
      'bg-blue-400 border-blue-500',
      'bg-blue-500 border-blue-600'
    ];
    return colors[value - 1];
  };

  const getIntensityTextColor = (value: number) => {
    return value >= 4 ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{emotion.icon}</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rate Your {emotion.name}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            How intense is this feeling right now?
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 border border-white/20">
          {/* Emotion Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{emotion.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  Youre feeling {emotion.name.toLowerCase()}
                </h3>
                {notes.trim() && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Check-in submitted!</h4>
                  <p className="text-green-700 text-sm">Your mood data has been saved successfully.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">Failed to submit</h4>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Intensity Scale */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4" />
                <span>Low Intensity</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>High Intensity</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {intensityLabels.map((intensity) => (
                <button
                  key={intensity.value}
                  onClick={() => setSelectedIntensity(intensity.value)}
                  disabled={isSubmitting || submitStatus === 'success'}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 transform
                    ${selectedIntensity === intensity.value
                      ? `${getIntensityColor(intensity.value)} scale-105 shadow-lg ring-2 ring-blue-400 ring-offset-2`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                    }
                    ${(isSubmitting || submitStatus === 'success') ? 'opacity-75 cursor-not-allowed' : ''}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    active:scale-95
                  `}
                  type="button"
                >
                  <div className="text-center space-y-2">
                    <div className={`text-2xl font-bold ${
                      selectedIntensity === intensity.value 
                        ? getIntensityTextColor(intensity.value)
                        : 'text-gray-700'
                    }`}>
                      {intensity.value}
                    </div>
                    <div className={`text-sm font-medium ${
                      selectedIntensity === intensity.value 
                        ? getIntensityTextColor(intensity.value)
                        : 'text-gray-700'
                    }`}>
                      {intensity.label}
                    </div>
                    <div className={`text-xs ${
                      selectedIntensity === intensity.value 
                        ? getIntensityTextColor(intensity.value)
                        : 'text-gray-500'
                    }`}>
                      {intensity.description}
                    </div>
                  </div>
                  
                  {selectedIntensity === intensity.value && (
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
              ))}
            </div>

            {/* Selected Intensity Display */}
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 font-medium">
                You rated your {emotion.name.toLowerCase()} as{' '}
                <span className="font-bold">
                  {intensityLabels.find(i => i.value === selectedIntensity)?.label}
                </span>
                {' '}({selectedIntensity}/5)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
            <button
              onClick={onBack}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`
                flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                ${(isSubmitting || submitStatus === 'success') 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`
                flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform
                ${(isSubmitting || submitStatus === 'success')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : submitStatus === 'success' ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Submitted!</span>
                </div>
              ) : (
                'Submit Check-in'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};