# Text Behind Image Editor

A modern web application that allows users to create images with text placed behind the subject. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Upload and process images with automatic background removal
- Live preview of text placement behind the subject
- Customize text properties:
  - Text content
  - Font family
  - Text color
  - X/Y position
- Download the final image as PNG

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd text-image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click the "Upload Image" button to select an image
2. Wait for the background removal process to complete
3. Use the control panel on the right to:
   - Edit the text content
   - Choose a font family
   - Pick a text color
   - Adjust text position using X/Y sliders
4. Click "Download Image" to save your creation

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- @imgly/background-removal
- HTML5 Canvas API

## License

MIT
