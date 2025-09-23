let currentVideoPath = null;

// Backend URL - change this to your deployed backend URL
const BACKEND_URL = "http://127.0.0.1:8081"; // For local development
// const BACKEND_URL = "https://your-backend.vercel.app"; // For production

async function generateShort() {
  const productName = document.getElementById("productName").value;
  const productImage = document.getElementById("productImage").files[0];
  const style = document.getElementById("styleSelect").value;
  const generateBtn = document.getElementById("generateBtn");
  const status = document.getElementById("status");
  const previewContainer = document.getElementById("preview-container");
  
  // Validate input
  if (!productName.trim()) {
    showStatus("Please enter a product name", "error");
    return;
  }
  
  // Show loading state
  generateBtn.disabled = true;
  generateBtn.querySelector(".btn-text").style.display = "none";
  generateBtn.querySelector(".btn-loading").style.display = "inline";
  showStatus("Generating your short... This may take a few minutes", "loading");
  previewContainer.style.display = "none";
  
  try {
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("style", style);
    if (productImage) {
      formData.append("product_image", productImage);
    }

    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    
    if (data.status === "success") {
      currentVideoPath = `${BACKEND_URL}${data.video_path}`;
      showStatus("Short generated successfully!", "success");
      showVideoPreview(currentVideoPath);
    } else {
      showStatus("Error: " + data.message, "error");
    }
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    generateBtn.querySelector(".btn-text").style.display = "inline";
    generateBtn.querySelector(".btn-loading").style.display = "none";
  }
}

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;
}

function showVideoPreview(videoPath) {
  const preview = document.getElementById("preview");
  const previewContainer = document.getElementById("preview-container");
  
  preview.src = videoPath;
  previewContainer.style.display = "block";
  
  // Scroll to preview
  previewContainer.scrollIntoView({ behavior: "smooth" });
}

function downloadVideo() {
  if (currentVideoPath) {
    const link = document.createElement("a");
    link.href = currentVideoPath;
    link.download = "generated_short.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function uploadToYouTube() {
  if (!currentVideoPath) {
    showStatus("No video to upload", "error");
    return;
  }
  
  showStatus("Uploading to YouTube...", "loading");
  
  try {
    const response = await fetch("/upload-youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        video_path: currentVideoPath,
        title: `AI Generated Short - ${document.getElementById("productName").value}`,
        description: "Generated using AI Shorts Generator"
      })
    });
    
    const data = await response.json();
    
    if (data.status === "success") {
      showStatus("Video uploaded to YouTube successfully!", "success");
    } else {
      showStatus("Upload failed: " + data.message, "error");
    }
  } catch (error) {
    showStatus("Upload error: " + error.message, "error");
  }
}

// Add some interactive effects
document.addEventListener("DOMContentLoaded", function() {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach(input => {
    input.addEventListener("focus", function() {
      this.parentElement.style.transform = "scale(1.02)";
    });
    
    input.addEventListener("blur", function() {
      this.parentElement.style.transform = "scale(1)";
    });
  });
  
  // Add enter key support for product name input
  document.getElementById("productName").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      generateShort();
    }
  });
});
