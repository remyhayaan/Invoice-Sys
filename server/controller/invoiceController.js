const Invoice = require('../models/invoice');

// Controller function to save an invoice
const saveInvoice = async (req, res) => {
  const { customerName, date, items } = req.body;

  if (!customerName || !date || !items || items.length === 0) {
    return res.status(400).json({ message: "Please complete all fields before saving the invoice." });
  }

  // Calculate the grand total
  const grandTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);

  try {
    // Create a new invoice
    const newInvoice = new Invoice({ customerName, date, grandTotal, items });
    await newInvoice.save();
    res.status(200).json({ message: "Invoice saved successfully!", invoice: newInvoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving invoice. Please try again." });
  }
};

// Controller function to get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching invoices." });
  }
};

module.exports = { saveInvoice, getInvoices };
