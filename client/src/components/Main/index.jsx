import { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Main = () => {
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ description: "", quantity: 1, price: 0 });

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch invoices from the server
  const fetchInvoices = async () => {
    try {
      const response = await fetch("https://invoice-sys.onrender.com");
      //const response = await fetch("http://localhost:8080/api/invoices/invoice"); 
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to fetch invoices.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.price < 0) {
      alert("Please enter valid item details.");
      return;
    }
    const itemTotal = (newItem.quantity * newItem.price).toFixed(2);
    setItems([...items, { ...newItem, total: itemTotal }]);
    setNewItem({ description: "", quantity: 1, price: 0 });
    closeModal();
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = async () => {
    if (!customerName || !date || items.length === 0) {
      alert("Please complete all fields before saving.");
      return;
    }
  
    const grandTotal = calculateGrandTotal();
  
    try {
      const response = await fetch("http://localhost:8080/api/invoices/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerName, date, items, grandTotal }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Invoice saved successfully!");
        setCustomerName("");
        setDate("");
        setItems([]);
        fetchInvoices(); // Refresh the list of invoices
      } else {
        alert(data.message || "Failed to save invoice.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice. Please try again.");
    }
  };
  

  return (
    <div className="main_container">
      <nav className="navbar">
        <h1>ACDBS</h1>
        <button className="white_btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <form className="invoice-form">
        <div className="form-group">
          <label>Customer Name: </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <h3>Items</h3>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>Shs {item.price}</td>
                <td>Shs {item.total}</td>
                <td>
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeItem(index)}
                  >
                    Remove Item
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className="add-item-btn" onClick={openModal}>
          Add Item
        </button>

        <div className="grand-total">
          <p>Grand Total: Shs{calculateGrandTotal()}</p>
        </div>

        <div className="action-btns">
          <button type="button" className="save-btn" onClick={handleSaveInvoice}>
            Save Invoice
          </button>
          <button type="button" className="print-btn" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>
      </form>

      {/* Modal for Adding Items */}
      {showModal && (
        <div className="modal">
          <h3>Add Item</h3>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Quantity: </label>
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })}
            />
          </div>
          <div className="form-group">
            <label>Price: </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-ok-btn" onClick={handleAddItem}>
              OK
            </button>
            <button type="button" className="modal-cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overlay for Modal */}
      {showModal && <div className="overlay" onClick={closeModal} />}

      {/* Display Saved Invoices */}
      <div className="invoices-section">
        <h2>Saved Invoices</h2>
        {invoices.map((invoice) => (
          <div key={invoice._id} className="invoice-card">
            <h4>{invoice.customerName}</h4>
            <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
            <p>Grand Total: Shs {invoice.grandTotal}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
