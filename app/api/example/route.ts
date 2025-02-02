import { NextResponse } from 'next/server';
import { handleApiError } from '../../utils/error-handling';
import type { ApiResponse } from '../../types/api';

export async function GET(): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    // Your code here
    return NextResponse.json({ 
      success: true,
      data: { /* your data */ }
    });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json({ 
      success: false,
      error: apiError.message 
    }, { 
      status: apiError.code 
    });
  }
} 