import {
  ExtractionResult as ExtractionResultType,
  ExtractionError,
} from "@/types";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

interface ExtractionResultProps {
  result: ExtractionResultType | null;
  error: ExtractionError | null;
}

const ExtractionResult: React.FC<ExtractionResultProps> = ({
  result,
  error,
}) => {
  if (!result) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <ReactJson
        src={result.regions}
        name={false}
        theme="monokai"
        style={{ padding: "16px", borderRadius: "8px" }}
        displayDataTypes={false}
        enableClipboard={false}
        collapsed={false}
      />
      {result.image_info && (
        <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
          <p>Bytes: {result.image_info.bytes}</p>
          <p>height: {result.image_info.height}</p>
          <p>width: {result.image_info.width}</p>
        </div>
      )}
    </div>
  );
};

export default ExtractionResult;
