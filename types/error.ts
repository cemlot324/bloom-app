export type ApiError = {
  message: string;
  code?: number;
  details?: unknown;
};

export class CustomError extends Error {
  code?: number;
  details?: unknown;

  constructor(message: string, code?: number, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
} 