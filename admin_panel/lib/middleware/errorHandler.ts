import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(error: unknown): NextResponse {
  // Log error for debugging (in production, use proper logging service)
  console.error('API Error:', error)

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        data: process.env.NODE_ENV === 'development' ? { code: error.code } : null,
        message: error.message,
      },
      { status: error.statusCode }
    )
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.join(', ')
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: `A record with this ${field || 'value'} already exists`,
        },
        { status: 409 }
      )
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      const field = error.meta?.field_name as string
      let message = 'Referenced record does not exist'
      
      if (field) {
        if (field.includes('author_id')) message = 'The author of this record does not exist or has been deleted. Please try logging out and in again.'
        if (field.includes('category_id')) message = 'The selected category does not exist'
        if (field.includes('featured_image_id')) message = 'The selected image does not exist'
      }

      return NextResponse.json(
        {
          success: false,
          data: process.env.NODE_ENV === 'development' ? { field } : null,
          message,
        },
        { status: 400 }
      )
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Record not found',
        },
        { status: 404 }
      )
    }

    // Other Prisma errors
    return NextResponse.json(
      {
        success: false,
        data: process.env.NODE_ENV === 'development' ? { code: error.code } : null,
        message: 'Database error occurred',
      },
      { status: 500 }
    )
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        success: false,
        data:
          process.env.NODE_ENV === 'development'
            ? { message: error.message }
            : null,
        message: 'Invalid data provided',
      },
      { status: 400 }
    )
  }

  // Handle standard errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        data: process.env.NODE_ENV === 'development' ? { stack: error.stack } : null,
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  )
}

// Helper to wrap async route handlers
export function withErrorHandler<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: unknown[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return errorHandler(error)
    }
  }) as T
}
