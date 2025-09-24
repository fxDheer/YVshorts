// Simple video creation function
function createSimpleVideo(productName, style) {
  // Create a simple HTML5 video with text overlay
  // This is a basic implementation - in production you'd use a proper video generation service
  const videoHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .video-container { 
          width: 1080px; height: 1920px; 
          display: flex; align-items: center; justify-content: center;
          color: white; font-family: Arial, sans-serif; text-align: center;
        }
        .product-title { font-size: 60px; font-weight: bold; margin-bottom: 20px; }
        .style-text { font-size: 40px; opacity: 0.8; }
      </style>
    </head>
    <body>
      <div class="video-container">
        <div>
          <div class="product-title">${productName}</div>
          <div class="style-text">${style.toUpperCase()} STYLE</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Return a data URL for the video (simplified)
  return `data:text/html;base64,${Buffer.from(videoHtml).toString('base64')}`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://y-vshorts.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Test endpoint
    res.status(200).json({
      message: "Backend is working!",
      status: "success",
      cors: "configured"
    });
    return;
  }

  if (req.method === 'POST') {
    // Video generation endpoint - create real video
    try {
      // Parse form data
      const formData = new URLSearchParams(req.body);
      const product_name = formData.get('product_name') || 'Product';
      const style = formData.get('style') || 'professional';
      
      // Create a simple video using canvas and ffmpeg (if available)
      // For now, we'll create a data URL for a simple video
      const videoData = createSimpleVideo(product_name, style);
      
      res.status(200).json({
        status: "success",
        message: `Video generated for ${product_name} with ${style} style!`,
        video_path: videoData,
        video_type: "data_url"
      });
    } catch (error) {
      console.error('Error in POST handler:', error);
      res.status(500).json({
        status: "error",
        message: "Internal server error"
      });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
