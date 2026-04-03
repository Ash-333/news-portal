import { NextRequest, NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export function validationMiddleware<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest): Promise<NextResponse | T> => {
    try {
      let data: unknown;

      // Parse request body based on content type
      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await req.json();
      } else if (contentType.includes("multipart/form-data")) {
        // For file uploads, validate the form data fields
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        // Try to parse as JSON by default
        try {
          data = await req.json();
        } catch {
          return NextResponse.json(
            {
              success: false,
              data: null,
              message: "Invalid content type. Expected application/json",
            },
            { status: 415 },
          );
        }
      }

      const validatedData = schema.parse(data);
      return validatedData;
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return NextResponse.json(
          {
            success: false,
            data: { errors },
            message: "Validation failed",
          },
          { status: 422 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid request data",
        },
        { status: 400 },
      );
    }
  };
}

// Helper function to validate query parameters
export function validateQueryParams<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>,
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  try {
    // Convert search params to object
    const params: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      // Handle array values
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as unknown[]).push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
    });

    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return {
      success: false,
      errors: [{ field: "unknown", message: "Invalid query parameters" }],
    };
  }
}
