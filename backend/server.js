const express = require('express');
const cors = require('cors');

const staffRoutes = require('./routes/staff');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/staff', staffRoutes);
app.use('/api/customer', customerRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ShipTrack API' }));

app.listen(PORT, () => {
  console.log(`ShipTrack backend running on http://localhost:${PORT}`);
});
