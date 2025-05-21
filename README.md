# Doc Insight UI

Doc Insight UI is a modern web application for extracting and analyzing information from document images using OCR (Optical Character Recognition) technology.

## Features

- 📄 Upload document images for information extraction
- 🔍 Automatic text detection and highlighting
- 📋 Extract structured data from documents 
- 🧠 Smart template-based extraction for different document types
- 🖼️ Real-time document preview with text highlighting
- 📱 Responsive design works on desktop and mobile

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI**: [React 19](https://react.dev/) with [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Integration**: RESTful API communication with backend OCR service

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/doc-insight-ui.git
cd doc-insight-ui
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_API_BASE_URL=http://your-api-endpoint
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build:prod
npm run start:prod
# or
yarn build:prod
yarn start:prod
```

## Project Structure

```
doc-insight-ui/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ExtractionResult.tsx
│   ├── FileUpload.tsx
│   ├── TemplateSelector.tsx
│   └── TextHighlighter.tsx
├── hooks/              # Custom React hooks
│   └── useExtraction.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
```

## How It Works

1. **Document Upload**: Users can drag and drop or select a document image to upload.
2. **Template Selection**: Users select the type of document (e.g., invoice, receipt, ID card) for targeted extraction.
3. **Text Extraction**: The image is sent to the backend service for OCR processing.
4. **Result Visualization**: Extracted text is highlighted on the original document with bounding boxes.
5. **Data Processing**: Structured data is extracted according to the selected template.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: URL of the backend OCR/extraction service
