import { NextResponse } from 'next/server'

const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>News Portal API - Swagger Documentation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #swagger-ui {
      margin: 0;
      padding: 0;
    }
    .topbar {
      display: none;
    }
    .swagger-ui .info .title {
      font-size: 2.5rem !important;
    }
    .custom-header {
      background: #1a1a2e;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }
    .custom-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .custom-header a {
      color: #00d9ff;
      text-decoration: none;
    }
    .server-select-wrapper {
      max-width: 300px !important;
    }
    .swagger-ui .opblock-tag {
      font-size: 1.2em !important;
    }
    .loading-message {
      padding: 40px;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="custom-header">
    <h1>📰 News Portal API</h1>
    <a href="/api-docs/json" target="_blank">View JSON Spec</a>
  </div>
  <div id="swagger-ui">
    <div class="loading-message">Loading API Documentation...</div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js" charset="UTF-8"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js" charset="UTF-8"></script>
  <script>
    function initSwagger() {
      try {
        window.SwaggerUIBundle({
          url: '/api-docs/json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIStandalonePreset
          ],
          layout: 'StandaloneLayout',
          docExpansion: 'list',
          filter: true,
          showExtensions: true,
          showCommonExtensions: true
        });
      } catch (e) {
        console.error('Error initializing Swagger:', e);
        document.getElementById('swagger-ui').innerHTML = 
          '<div style="padding: 20px; color: red;"><h2>Error loading Swagger UI</h2><p>' + e.message + '</p></div>';
      }
    }
    
    // Wait for scripts to load
    if (document.readyState === 'complete') {
      initSwagger();
    } else {
      window.addEventListener('load', initSwagger);
    }
  </script>
</body>
</html>
`

export async function GET() {
  return new NextResponse(swaggerHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}