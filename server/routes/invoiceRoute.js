const express = require('express');
const router = express.Router();
const { saveInvoice, getInvoices } = require('../controllers/invoiceController');

// Route to save an invoice
router.post('/save', saveInvoice);

// Route to get all invoices
router.get('/', getInvoices);

module.exports = router;
