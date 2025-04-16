import { FileValidationError } from "@/types";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/pdf"];

export const validateFile = (file: File): void => {
  if (file.size > MAX_SIZE) {
    throw {
      code: "FILE_TOO_LARGE",
      message: "File size exceeds 5MB limit",
    } as FileValidationError;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw {
      code: "INVALID_FILE_TYPE",
      message: "Invalid file type. Allowed types: JPEG, PNG, PDF",
    } as FileValidationError;
  }
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject({
        code: "UPLOAD_FAILED",
        message: "Failed to read file",
      } as FileValidationError);
    };
  });
};
