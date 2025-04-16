export interface Template {
  id: string;
  name: string;
}

export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  score: number;
}

export interface TextItem {
  text: string;
  confidence: number;
  bounding_box: BoundingBox;
}

export interface ExtractionResultData {
  text_items: TextItem[];
  original_width?: number;
  original_height?: number;
  [key: string]: any;
}

export interface ExtractionResult {
  success: boolean;
  data: ExtractionResultData;
  metadata?: {
    processingTime: number;
    timestamp: string;
  };
}

export interface ExtractionError {
  message: string;
  code?: string;
  details?: any;
}

export interface FileValidationError {
  code: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE" | "UPLOAD_FAILED";
  message: string;
}

export interface ExtractionState {
  file: File | null;
  template: string;
  result: ExtractionResult | null;
  error: ExtractionError | null;
  isLoading: boolean;
}
