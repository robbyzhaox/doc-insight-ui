import { NextResponse } from "next/server";
import { ExtractionResult } from "@/types";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual extraction logic
    const result: ExtractionResult = {
      success: true,
      data: {
        text: "Sample extracted text",
        confidence: 0.95,
      },
      metadata: {
        processingTime: 0.5,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { message: "Failed to process image" },
      { status: 500 }
    );
  }
}
