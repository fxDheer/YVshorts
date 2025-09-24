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
    // Video generation endpoint - simplified
    try {
      // Just return a success response for now
      res.status(200).json({
        status: "success",
        message: "Video generation started successfully!",
        video_path: "/outputs/demo_video.mp4"
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
