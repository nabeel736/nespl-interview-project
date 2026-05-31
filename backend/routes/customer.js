const express = require('express');
const router = express.Router();
const db = require('../database');

// Customer "login" — just validate that at least one shipment exists for this company name
router.post('/login', (req, res) => {
  const { company_name } = req.body;

  if (!company_name || company_name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Company name is required' });
  }

  // We allow login for any company name; they'll just see 0 shipments if none exist
  return res.json({ success: true, role: 'customer', company_name: company_name.trim() });
});

// Get all shipments for this customer (by sender_name = company_name)
router.get('/shipments', (req, res) => {
  const { company_name } = req.query;

  if (!company_name) {
    return res.status(400).json({ message: 'company_name query param required' });
  }

  const shipments = db.prepare(`
    SELECT * FROM shipments
    WHERE LOWER(sender_name) = LOWER(?)
    ORDER BY created_at DESC
  `).all(company_name.trim());

  res.json(shipments);
});

// Get single shipment detail + history (only if it belongs to the customer)
router.get('/shipments/:tracking_id', (req, res) => {
  const { tracking_id } = req.params;
  const { company_name } = req.query;

  if (!company_name) {
    return res.status(400).json({ message: 'company_name query param required' });
  }

  const shipment = db.prepare(`
    SELECT * FROM shipments
    WHERE tracking_id = ? AND LOWER(sender_name) = LOWER(?)
  `).get(tracking_id, company_name.trim());

  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found or access denied' });
  }

  const history = db.prepare(`
    SELECT status, updated_at FROM status_history
    WHERE tracking_id = ?
    ORDER BY updated_at ASC
  `).all(tracking_id);

  res.json({ ...shipment, history });
});

module.exports = router;
