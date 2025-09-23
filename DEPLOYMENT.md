# AI Shorts Generator - Vercel Deployment

## 🚀 Deploy to Vercel

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   vercel --prod
   ```

3. **Your frontend will be live at:** `https://your-project.vercel.app`

### Backend Deployment (Render/Railway)

1. **Deploy backend to Render or Railway**
2. **Update frontend/script.js:**
   ```javascript
   const BACKEND_URL = "https://your-backend-url.com";
   ```

## 🔧 Local Development

### Frontend (Vercel Dev)
```bash
vercel dev
```

### Backend (Local)
```bash
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8081
```

## 📁 Project Structure
```
├── frontend/          # Vercel static frontend
├── backend/           # FastAPI backend (deploy separately)
├── vercel.json        # Vercel configuration
└── package.json       # Frontend dependencies
```

## 🌐 URLs
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.vercel.app` (or Render/Railway)
