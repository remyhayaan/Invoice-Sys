
const mongoose = require('mongoose');

// Define the invoice item schema
const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Define the invoice schema
const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  grandTotal: { type: Number, required: true },
  items: { type: [itemSchema], required: true }, // Use the sub-schema for items
});

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
