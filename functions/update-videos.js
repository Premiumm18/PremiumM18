// Netlify function to update videos.json
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }
    
    try {
        // Parse the incoming data
        const data = JSON.parse(event.body);
        
        // Validate the data
        if (!Array.isArray(data.videos)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid data format' })
            };
        }
        
        // In a real implementation, you would:
        // 1. Validate the user is authenticated
        // 2. Validate each video in the array
        // 3. Write to videos.json
        
        // For this example, we'll just return a success message
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Videos updated successfully',
                count: data.videos.length
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error updating videos',
                error: error.message 
            })
        };
    }
};