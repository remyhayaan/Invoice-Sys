const mongoose = require('mongoose');

// Define the invoice schema
const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  grandTotal: { type: Number, required: true },
  items: { type: Array, required: true },
});

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;

