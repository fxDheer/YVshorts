from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from video_pipeline import generate_short
import os

app = FastAPI()

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

@app.get("/frontend/")
async def frontend():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.post("/generate")
async def create_short(product_name: str = Form(...), product_image: UploadFile = None):
    try:
        image_path = None
        if product_image:
            os.makedirs("static/assets", exist_ok=True)
            image_path = f"static/assets/{product_image.filename}"
            with open(image_path, "wb") as f:
                f.write(await product_image.read())

        output_video = generate_short(product_name, image_path)
        return JSONResponse({"status": "success", "video_path": f"/{output_video}"})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
