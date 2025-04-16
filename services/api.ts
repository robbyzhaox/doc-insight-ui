import { ExtractionResult, ExtractionError } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;
  
export class ApiError extends Error implements ExtractionError {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

export const extractDocument = async (
  image: string,
  template: string
): Promise<ExtractionResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ocr-json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        image,
        template 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Extraction failed",
        "EXTRACTION_FAILED",
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred", "NETWORK_ERROR", error);
  }
};
