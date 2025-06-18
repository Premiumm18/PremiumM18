const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  // 1. Verify authentication
  const auth = event.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // 2. Process data
  try {
    const data = JSON.parse(event.body);
    const filePath = path.join(__dirname, '..', 'videos.json');

    // 3. Save to persistent storage
    fs.writeFileSync(filePath, JSON.stringify(data.videos, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        updated: new Date().toISOString() 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to update',
        details: error.message 
      })
    };
  }
};
