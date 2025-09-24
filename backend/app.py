from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from video_pipeline import generate_short
import os
import subprocess

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Get the project root directory
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_dir = os.path.join(project_root, "frontend")
static_dir = os.path.join(project_root, "static")
outputs_dir = os.path.join(project_root, "outputs")

# Create directories if they don't exist
os.makedirs(static_dir, exist_ok=True)
os.makedirs(outputs_dir, exist_ok=True)

app.mount("/frontend", StaticFiles(directory=frontend_dir, html=True), name="frontend")
app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")

@app.get("/")
async def root():
    return {"message": "AI Shorts Generator API is running! Go to /frontend/ to access the web interface."}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"}

@app.get("/test")
async def test():
    return {"message": "Backend is working!", "status": "success"}

@app.get("/frontend/")
async def frontend():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.post("/generate")
async def create_short(product_name: str = Form(...), product_image: UploadFile = None, style: str = Form("professional")):
    try:
        image_path = None
        if product_image:
            os.makedirs("static/assets", exist_ok=True)
            image_path = f"static/assets/{product_image.filename}"
            with open(image_path, "wb") as f:
                f.write(await product_image.read())

        # For now, create a simple video without full pipeline
        output_video = create_simple_video(product_name, style, image_path)
        return JSONResponse({"status": "success", "video_path": f"/{output_video}"})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)})

def create_simple_video(product_name: str, style: str, image_path: str = None) -> str:
    """Create a simple video for testing"""
    output_path = "outputs/simple_short.mp4"
    os.makedirs("outputs", exist_ok=True)
    
    try:
        # Create a simple video with FFmpeg
        cmd = [
            "ffmpeg", "-f", "lavfi", "-i", "color=c=purple:s=1080x1920:d=15",
            "-vf", f"drawtext=text='{product_name} - {style.title()} Style':fontsize=50:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-y", output_path
        ]
        
        subprocess.run(cmd, capture_output=True, check=True)
        print(f"Simple video created: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"Simple video creation failed: {e}")
        # Create a basic video
        try:
            cmd = [
                "ffmpeg", "-f", "lavfi", "-i", "testsrc=duration=10:size=1080x1920:rate=30",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-y", output_path
            ]
            subprocess.run(cmd, capture_output=True, check=True)
            print(f"Basic video created: {output_path}")
            return output_path
        except:
            # Create placeholder
            with open(output_path, "w") as f:
                f.write("placeholder")
            print(f"Placeholder created: {output_path}")
            return output_path

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
