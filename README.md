# Gen-AI-Full-Stack-Web

A Full-Stack MERN web application that uses **Google Gemini AI** to analyze uploaded documents (resumes/CVs), extract skills intelligently, and automatically generate a polished PDF report using **Puppeteer**.

## How It Works

```
User uploads PDF/Doc → Multer parses file → Gemini AI analyzes content
→ Skills & insights extracted → Puppeteer generates PDF report → Returned to user
```

## Key Features

* **AI Document Analysis:** Google Gemini AI reads uploaded documents and performs intelligent skill extraction and gap analysis.
* **Automated PDF Generation:** Puppeteer renders a structured HTML report and converts it to a downloadable PDF — no third-party PDF services needed.
* **Full-Stack MERN:** React (TypeScript + SCSS) frontend with Express/Node.js backend, MongoDB for data persistence.
* **Type-Safe Codebase:** TypeScript used across both frontend and backend (74% TS, 24% SCSS).

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, SCSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API |
| PDF Engine | Puppeteer |
| File Handling | Multer |

## ⚙️ Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend
```env
VITE_API_URL=http://localhost:8000
```

## Vite Proxy Configuration

To avoid CORS issues in development, the frontend uses Vite's built-in proxy. All `/api` requests from React are forwarded to the Express backend automatically — no need to hardcode the backend URL in every fetch call.

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

## Project Structure

```
Gen-AI-Full-Stack-Web/
├── Backend/        # Express API, Gemini integration, Puppeteer PDF engine
└── Frontend/       # React + TypeScript + SCSS UI
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload document → Gemini analyzes → returns skill insights |
| POST | `/api/generate-pdf` | Takes analysis result → generates & returns PDF |
| GET | `/api/history` | Fetch past analysis records |
