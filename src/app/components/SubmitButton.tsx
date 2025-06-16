import React from 'react';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  buttonText?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isDisabled,
  onSubmit,
  buttonText = "Submit Check-in",
}) => {
  const isNextStep = buttonText.includes('Continue');

  return (
    <button
      onClick={onSubmit}
      disabled={isDisabled || isSubmitting}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform
        ${isDisabled || isSubmitting
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      <div className="flex items-center justify-center space-x-2">
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {isNextStep ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{buttonText}</span>
          </>
        )}
      </div>
    </button>
  );
};