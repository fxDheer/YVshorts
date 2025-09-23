# AI Shorts Generator

A full-stack web application that automatically generates YouTube Shorts videos based on product names using AI.

## Features

- **AI Script Generation**: Uses OpenAI to create engaging short scripts (<60 seconds)
- **Voice Generation**: Uses ElevenLabs API for high-quality voiceovers
- **Avatar Animation**: Integrates with D-ID for character animations
- **Video Assembly**: Combines product images, subtitles, and avatars into final videos
- **Modern UI**: Clean, dark-themed interface with real-time preview
- **YouTube Upload**: Optional automatic upload to YouTube

## Project Structure

```
shorts-generator/
├── backend/
│   ├── app.py                 # FastAPI server
│   ├── video_pipeline.py      # Main video generation pipeline
│   ├── script_generator.py    # OpenAI script generation
│   ├── voice_generator.py     # ElevenLabs voice generation
│   ├── avatar_animator.py     # D-ID avatar animation
│   ├── video_editor.py        # Video assembly with MoviePy
│   ├── youtube_uploader.py    # YouTube API integration
│   ├── config.json           # API keys configuration
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── index.html            # Main UI
│   ├── style.css             # Styling
│   └── script.js             # Frontend logic
├── static/assets/            # Uploaded product images
└── outputs/shorts/           # Generated videos
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys

Edit `backend/config.json` and add your API keys:

```json
{
  "openai_api_key": "your-openai-api-key",
  "elevenlabs_api_key": "your-elevenlabs-api-key",
  "did_api_key": "your-d-id-api-key",
  "heygen_api_key": "your-heygen-api-key",
  "deepmotion_api_key": "your-deepmotion-api-key",
  "youtube": {
    "client_id": "your-google-client-id",
    "client_secret": "your-google-client-secret",
    "redirect_uri": "http://localhost:8080",
    "refresh_token": "your-youtube-refresh-token"
  }
}
```

### 3. Run the Backend Server

```bash
cd backend
uvicorn app:app --reload
```

The server will start on `http://localhost:8080`

### 4. Open the Frontend

Open `frontend/index.html` in your web browser, or serve it through the FastAPI server at `http://localhost:8080/frontend/`

## Usage

1. **Enter Product Name**: Type the name of the product you want to promote
2. **Upload Image** (Optional): Add a product image for visual appeal
3. **Select Style**: Choose from Professional, Casual, Energetic, or Minimalist
4. **Generate Short**: Click the button and wait for AI to create your video
5. **Preview & Download**: Watch your generated short and download or upload to YouTube

## API Endpoints

- `POST /generate` - Generate a new short video
  - Parameters: `product_name`, `product_image` (optional), `style`
  - Returns: Video path and status

- `POST /upload-youtube` - Upload video to YouTube
  - Parameters: `video_path`, `title`, `description`
  - Returns: Upload status

## Requirements

- Python 3.8+
- Node.js (for frontend development)
- API keys for:
  - OpenAI (for script generation)
  - ElevenLabs (for voice generation)
  - D-ID (for avatar animation)
  - Google YouTube API (for uploads)

## Notes

- Videos are stored in `outputs/shorts/` directory
- The app works locally first, then can be deployed to Render/Vercel
- No user authentication required
- Optimized for YouTube Shorts format (9:16 aspect ratio)

## Troubleshooting

- Make sure all API keys are valid and have sufficient credits
- Check that all dependencies are installed correctly
- Ensure the `outputs` directory has write permissions
- For video generation issues, check MoviePy installation and codec support
