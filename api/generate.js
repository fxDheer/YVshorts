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
    // Video generation endpoint
    const { product_name, style } = req.body;
    
    // For now, just return a success response
    // In a real implementation, you'd generate a video here
    res.status(200).json({
      status: "success",
      message: `Video generation started for ${product_name} with ${style} style`,
      video_path: "/outputs/demo_video.mp4"
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
