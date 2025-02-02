import type { ApiError } from '../../types/error';

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 500,
    };
  }
  return {
    message: 'An unknown error occurred',
    code: 500,
  };
}; 