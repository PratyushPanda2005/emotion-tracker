export interface Emotion {
    id: string;
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    hoverColor: string;
  }
  
export interface MoodCheckIn {
    emotion: string;
    intensity: number;
    notes: string;
    timestamp: string;
  }
  
export interface ApiResponse {
    id: number;
    emotion: string;
    intensity: number;
    notes: string;
    timestamp: string;
  }