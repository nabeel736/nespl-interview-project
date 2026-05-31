const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const STAFF_PASSWORD = 'staff123';

const STATUS_SEQUENCE = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];

// Staff login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === STAFF_PASSWORD) {
    return res.json({ success: true, role: 'staff' });
  }
  return res.status(401).json({ success: false, message: 'Invalid password' });
});

// Get all shipments
router.get('/shipments', (req, res) => {
  const shipments = db.prepare(`
    SELECT * FROM shipments ORDER BY created_at DESC
  `).all();
  res.json(shipments);
});

// Create a new shipment
router.post('/shipments', (req, res) => {
  const { item_name, sender_name, source, destination } = req.body;

  if (!item_name || !sender_name || !source || !destination) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Generate tracking ID: TRK-XXXXXXXX
  const tracking_id = 'TRK-' + uuidv4().replace(/-/g, '').toUpperCase().slice(0, 8);

  const now = new Date().toISOString().replace('T', ' ').split('.')[0];

  db.prepare(`
    INSERT INTO shipments (tracking_id, item_name, sender_name, source, destination, current_status, created_at)
    VALUES (?, ?, ?, ?, ?, 'Pending', ?)
  `).run(tracking_id, item_name, sender_name.trim(), source, destination, now);

  db.prepare(`
    INSERT INTO status_history (tracking_id, status, updated_at) VALUES (?, 'Pending', ?)
  `).run(tracking_id, now);

  const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_id = ?').get(tracking_id);
  res.status(201).json(shipment);
});

// Update shipment status (advance to next)
router.patch('/shipments/:tracking_id/status', (req, res) => {
  const { tracking_id } = req.params;

  const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_id = ?').get(tracking_id);
  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found' });
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(shipment.current_status);
  if (currentIndex === STATUS_SEQUENCE.length - 1) {
    return res.status(400).json({ message: 'Shipment already delivered' });
  }

  const newStatus = STATUS_SEQUENCE[currentIndex + 1];
  const now = new Date().toISOString().replace('T', ' ').split('.')[0];

  db.prepare('UPDATE shipments SET current_status = ? WHERE tracking_id = ?').run(newStatus, tracking_id);
  db.prepare('INSERT INTO status_history (tracking_id, status, updated_at) VALUES (?, ?, ?)').run(tracking_id, newStatus, now);

  const updated = db.prepare('SELECT * FROM shipments WHERE tracking_id = ?').get(tracking_id);
  res.json(updated);
});

module.exports = router;
