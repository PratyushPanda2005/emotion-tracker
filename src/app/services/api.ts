export interface MoodCheckInPayload {
    emotion: string;
    notes: string;
    timestamp: string;
  }
  
export interface ApiResponse {
    id: number;
    emotion: string;
    notes: string;
    timestamp: string;
  }
  
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
export const submitMoodCheckIn = async (payload: MoodCheckInPayload): Promise<ApiResponse> => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }
  
      const data = await response.json();
      
     
      return {
        id: data.id,
        emotion: payload.emotion,
        notes: payload.notes,
        timestamp: payload.timestamp,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors or other issues
      throw new ApiError('Network error. Please check your connection and try again.');
    }
  };