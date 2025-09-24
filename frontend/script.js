let currentVideoPath = null;

// Backend URL - change this to your deployed backend URL
// const BACKEND_URL = "http://127.0.0.1:8081"; // For local development
const BACKEND_URL = "https://yvshorts-production.up.railway.app"; // For production (Railway backend)

// Force cache refresh
console.log("Script loaded - Backend URL:", BACKEND_URL);

// Test backend connection on page load
async function testBackend() {
  try {
    console.log("Testing backend connection...");
    const res = await fetch(`${BACKEND_URL}/test`);
    const data = await res.json();
    console.log("✅ Backend test successful:", data);
  } catch (e) {
    console.error("❌ Backend test failed:", e);
  }
}

// Test backend when page loads
window.addEventListener("DOMContentLoaded", testBackend);

async function generateShort() {
  console.log("generateShort function called!");
  
  const productName = document.getElementById("productName").value;
  const productImage = document.getElementById("productImage").files[0];
  const style = document.getElementById("styleSelect").value;
  const generateBtn = document.getElementById("generateBtn");
  const status = document.getElementById("status");
  const previewContainer = document.getElementById("preview-container");
  
  console.log("Product name:", productName);
  console.log("Style:", style);
  
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
    // First test if backend is available
    showStatus("Testing backend connection...", "loading");
    
    try {
      console.log("Testing backend at:", `${BACKEND_URL}/test`);
      const testResponse = await fetch(`${BACKEND_URL}/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("Test response status:", testResponse.status);
      console.log("Test response headers:", testResponse.headers);
      
      if (!testResponse.ok) {
        throw new Error(`Backend not responding: ${testResponse.status} ${testResponse.statusText}`);
      }
      
      const testData = await testResponse.json();
      console.log("Backend test successful:", testData);
      
    } catch (testError) {
      console.log("Backend not available, falling back to demo mode:", testError);
      showStatus(`Backend unavailable (${testError.message}), using demo mode...`, "loading");
      
      // Fallback to demo mode
      await new Promise(resolve => setTimeout(resolve, 2000));
      const sampleScript = generateSampleScript(productName, style);
      showStatus("Script generated successfully! (Demo Mode)", "success");
      showDemoResult(sampleScript, productName);
      return;
    }
    
    // Call real backend API
    showStatus("Generating AI script...", "loading");
    
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
      showStatus("Video generated successfully!", "success");
      currentVideoPath = data.video_path;
      showVideoPreview(data.video_path);
    } else {
      throw new Error(data.message || "Video generation failed");
    }
    
  } catch (error) {
    console.error("Error in generateShort:", error);
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

function generateSampleScript(productName, style) {
  const scripts = {
    professional: `[Opening shot: Clean, modern presentation of ${productName}]

🎵 [Upbeat corporate music]

**Voiceover:** "Introducing ${productName} - where innovation meets excellence."

[Quick cuts showcasing key features]

**Voiceover:** "Experience the future today. Professional quality, unmatched performance."

[Closing shot with call-to-action]

**Voiceover:** "Ready to transform your world? Get started with ${productName} now!"`,

    casual: `[Fun, relaxed intro with ${productName}]

🎵 [Trendy background music]

**Voiceover:** "Hey! Check this out - ${productName} is absolutely game-changing!"

[Real-world usage shots]

**Voiceover:** "Seriously, this thing is amazing. You've got to try it!"

[Social proof moment]

**Voiceover:** "Join thousands who already love ${productName}. What are you waiting for?"`,

    energetic: `[Fast-paced, dynamic intro]

🎵 [High-energy music]

**Voiceover:** "BOOM! ${productName} is here and it's INCREDIBLE!"

[Quick cuts, exciting visuals]

**Voiceover:** "This will blow your mind! The future is NOW!"

[Action-packed finale]

**Voiceover:** "Don't miss out! Get ${productName} TODAY and change everything!"`,

    minimalist: `[Clean, simple shot of ${productName}]

🎵 [Subtle ambient music]

**Voiceover:** "${productName}. Simple. Powerful. Perfect."

[Minimalist feature highlights]

**Voiceover:** "Everything you need. Nothing you don't."

[Elegant closing]

**Voiceover:** "Discover ${productName}. Experience the difference."`
  };
  
  return scripts[style] || scripts.professional;
}

function showDemoResult(script, productName) {
  console.log("showDemoResult called with:", productName, script);
  
  const previewContainer = document.getElementById("preview-container");
  const preview = document.getElementById("preview");
  
  console.log("preview element:", preview);
  console.log("previewContainer element:", previewContainer);
  
  // Hide the video element and show script content instead
  preview.style.display = "none";
  
  // Create a script display div
  let scriptDisplay = document.getElementById("script-display");
  if (!scriptDisplay) {
    scriptDisplay = document.createElement("div");
    scriptDisplay.id = "script-display";
    previewContainer.appendChild(scriptDisplay);
  }
  
  scriptDisplay.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; padding: 40px; border-radius: 15px; text-align: center;">
      <h3 style="margin-bottom: 20px;">🎬 Generated Script for "${productName}"</h3>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; 
                  text-align: left; font-family: monospace; white-space: pre-line; 
                  line-height: 1.6; max-height: 300px; overflow-y: auto;">
${script}
      </div>
      <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
        ✨ This is a demo script. Connect a backend for full video generation!
      </p>
    </div>
  `;
  
  scriptDisplay.style.display = "block";
  previewContainer.style.display = "block";
  previewContainer.scrollIntoView({ behavior: "smooth" });
  
  console.log("Demo result displayed!");
}

function showVideoPreview(videoPath) {
  const preview = document.getElementById("preview");
  const previewContainer = document.getElementById("preview-container");
  const scriptDisplay = document.getElementById("script-display");
  
  // Hide script display and show video
  if (scriptDisplay) {
    scriptDisplay.style.display = "none";
  }
  preview.style.display = "block";
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
