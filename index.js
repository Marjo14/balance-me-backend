const express = require('express');
const intentionRoutes = require('./src/routes/intentionRoutes');

const app = express();
app.use(express.json());

// Main Routes Entry Point
app.use('/intentions', intentionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});