import { useReducer, useCallback } from "react";
import { ExtractionState, ExtractionResult, ExtractionError } from "@/types";
import { extractDocument } from "@/services/api";
import { validateFile, toBase64 } from "@/utils/validation";

type Action =
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "START_EXTRACTION" }
  | { type: "EXTRACTION_SUCCESS"; payload: ExtractionResult }
  | { type: "EXTRACTION_ERROR"; payload: ExtractionError }
  | { type: "CLEAR_ERROR" };

const initialState: ExtractionState = {
  file: null,
  template: "invoice",
  result: null,
  error: null,
  isLoading: false,
};

function extractionReducer(
  state: ExtractionState,
  action: Action
): ExtractionState {
  switch (action.type) {
    case "SET_FILE":
      return { ...state, file: action.payload, error: null, result: null };
    case "SET_TEMPLATE":
      return { ...state, template: action.payload, error: null };
    case "START_EXTRACTION":
      return { ...state, isLoading: true, error: null };
    case "EXTRACTION_SUCCESS":
      return {
        ...state,
        isLoading: false,
        result: action.payload,
        error: null,
      };
    case "EXTRACTION_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export const useExtraction = () => {
  const [state, dispatch] = useReducer(extractionReducer, initialState);

  const handleFileSelect = (file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  };

  const handleTemplateSelect = (template: string) => {
    dispatch({ type: "SET_TEMPLATE", payload: template });
  };

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const handleExtract = async () => {
    if (!state.file || !state.template) {
      dispatch({
        type: "EXTRACTION_ERROR",
        payload: { message: "Please select both file and template" },
      });
      return;
    }

    dispatch({ type: "START_EXTRACTION" });

    try {
      validateFile(state.file);
      const base64 = await toBase64(state.file);
      const result = await extractDocument(base64.split(",")[1], state.template);

      dispatch({ type: "EXTRACTION_SUCCESS", payload: result });
    } catch (error) {
      dispatch({
        type: "EXTRACTION_ERROR",
        payload: {
          message: error instanceof Error ? error.message : "Extraction failed",
        },
      });
    }
  };

  return {
    state,
    handleFileSelect,
    handleTemplateSelect,
    handleExtract,
    clearError,
  };
};
