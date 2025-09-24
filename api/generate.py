from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://y-vshorts.vercel.app",    # ✅ must match exactly the frontend URL
        "https://v-shorts.vercel.app",     # ✅ add this too if you sometimes use this domain
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def root():
    return {"message": "AI Shorts Generator API is running!"}

@app.get("/test")
async def test():
    return {"message": "Backend is working!", "status": "success", "cors": "configured"}

@app.options("/test")
async def test_options():
    return {"message": "CORS preflight OK"}

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

# For Vercel
handler = app
