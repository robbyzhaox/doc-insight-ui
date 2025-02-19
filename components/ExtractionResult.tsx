export default function ExtractionResult({ result, error }) {
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
        <h3 className="font-medium mb-2">Error occurred:</h3>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!result) return null;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800">Extracted Data</h3>

      <div className="space-y-2">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">File Name:</span>
          <span className="text-gray-800">{result.data.fileName}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Template Type:</span>
          <span className="text-gray-800 capitalize">{result.data.templateType}</span>
        </div>

        {Object.entries(result.data.extractedFields).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b pb-2">
            <span className="text-gray-600 capitalize">{key}:</span>
            <span className="text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}