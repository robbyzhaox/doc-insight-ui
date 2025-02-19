export default function FileUpload({ onFileSelect }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-primary">
      <label className="cursor-pointer">
        <input
          type="file"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <div className="space-y-2">
          <svg 
            className="h-12 w-12 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600">
            <span className="font-medium text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, JPG, JPEG up to 10MB</p>
        </div>
      </label>
    </div>
  )
}