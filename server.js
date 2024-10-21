// server.js
const app = require('./app'); // Import the app from app.js
const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the URL to the console
});
