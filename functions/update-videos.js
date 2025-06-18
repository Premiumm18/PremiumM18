const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  // Verify Basic Auth
  const auth = event.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const filePath = path.join(process.cwd(), 'videos.json');
    
    // Save to persistent storage
    fs.writeFileSync(filePath, JSON.stringify(data.videos, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Videos updated successfully' 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to update videos',
        details: error.message 
      })
    };
  }
};
