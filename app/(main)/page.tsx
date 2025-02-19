'use client' // 必须标记为客户端组件
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import TemplateSelector from '@/components/TemplateSelector'
import ExtractionResult from '@/components/ExtractionResult'

export default function Home() {
  const [file, setFile] = useState(null)
  const [template, setTemplate] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleExtract = async () => {
    if (!file || !template) {
      setError('Please select both a file and template')
      return
    }

    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('template', template)

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Extraction failed')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Document Information Extractor
      </h1>
      
      <div className="space-y-6">
        <FileUpload onFileSelect={setFile} />
        <TemplateSelector 
          selectedTemplate={template} 
          onTemplateSelect={setTemplate} 
        />
        
        <button 
          onClick={handleExtract}
          disabled={isLoading}
          className={`
            w-full py-3 px-6 rounded-lg font-medium transition-colors
            ${isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-primary bg-blue-600 text-white'}
          `}
        >
          {isLoading ? 'Processing...' : 'Extract Information'}
        </button>

        <ExtractionResult result={result} error={error} />
      </div>
    </div>
  )
}