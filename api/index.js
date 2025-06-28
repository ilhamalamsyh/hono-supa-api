module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Simple routing
  if (req.url === "/" || req.url === "") {
    res.status(200).json({
      message: "API is running - Express style",
      timestamp: new Date().toISOString(),
      status: "ok",
      method: req.method,
      url: req.url,
    });
    return;
  }

  if (req.url === "/debug") {
    res.status(200).json({
      message: "Debug working - Express style",
      env: {
        supabaseUrl: process.env.SUPABASE_URL ? "Set" : "Missing",
        supabaseKey: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
        jwtSecret: process.env.JWT_SECRET ? "Set" : "Missing",
      },
      method: req.method,
      url: req.url,
    });
    return;
  }

  // 404 for unknown routes
  res.status(404).json({
    error: "Not Found",
    message: "Route not found",
    url: req.url,
  });
};
