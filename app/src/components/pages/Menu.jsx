import React, { useEffect, useState } from 'react';
// import PlacesAutocomplete from 'react-places-autocomplete';
import { FaShoppingCart } from 'react-icons/fa';
import '../CssModule/Menu.css';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

// Use CSS classes for modal styles
// .modal-overlay and .modal-content are defined in Menu.css


const Menu = () => {
  const [items, setItems] = useState([]);
  // Categories
  const categories = [
    { key: 'Breakfast', label: 'Breakfast' },
    { key: 'Big Meals', label: 'Big Meals' },
    { key: 'Drinks', label: 'Drinks' },
    { key: 'Desserts', label: 'Desserts' },
  ];
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('orderUser');
    return savedUser ? JSON.parse(savedUser) : { name: '', phone: '' };
  });
  const [receipt, setReceipt] = useState(null); // New state for receipt
  const [showCart, setShowCart] = useState(false); // Controls cart modal
  const [orderStatus, setOrderStatus] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  // For viewing past receipts
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [userReceipts, setUserReceipts] = useState([]);

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/food/';
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch menu');
        return res.json();
      })
      .then((data) => {
        // Use the real category from the backend
        const itemsWithQty = data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setItems(itemsWithQty);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (id, qty) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(qty) || 1 } : item
      )
    );
  };

  // Persist cart and user info in localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orderUser', JSON.stringify(user));
  }, [user]);

  const handleAddToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item }]);
    }
  };

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Add this state


  // Authentication state based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    let isValid = false;
    if (storedUser) {
      // If loginTime is missing, set it now
      if (!loginTime) {
        localStorage.setItem('loginTime', Date.now().toString());
      }
      const now = Date.now();
      const loginTimestamp = parseInt(localStorage.getItem('loginTime'), 10);
      if (now - loginTimestamp < 86400000) {
        isValid = true;
        const parsedUser = JSON.parse(storedUser);
        setUser((prev) => ({ ...prev, name: parsedUser.name || '', phone: parsedUser.phone || '' }));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
      }
    }
    setIsAuthenticated(isValid);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
    setUser({ name: '', phone: '' });
    alert('Logged out successfully');
    // Optionally navigate to home or login page
    navigate('/');
  };

  // Helper: Save receipt for logged-in user
  const saveReceiptForUser = (receiptObj) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { username } = JSON.parse(storedUser);
    if (!username) return;
    const receiptsKey = `userReceipts_${username}`;
    let receipts = [];
    try {
      receipts = JSON.parse(localStorage.getItem(receiptsKey)) || [];
    } catch {}
    receipts.unshift({
      receipt: receiptObj.receipt || receiptObj,
      receipt_url: receiptObj.receipt_url || '',
      date: new Date().toISOString(),
    });
    // Keep only last 10 receipts
    receipts = receipts.slice(0, 10);
    localStorage.setItem(receiptsKey, JSON.stringify(receipts));
  };

  // Load receipts for logged-in user
  const loadUserReceipts = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return setUserReceipts([]);
    const { username } = JSON.parse(storedUser);
    if (!username) return setUserReceipts([]);
    const receiptsKey = `userReceipts_${username}`;
    let receipts = [];
    try {
      receipts = JSON.parse(localStorage.getItem(receiptsKey)) || [];
    } catch {}
    setUserReceipts(receipts);
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      alert('Please register or log in to place an order.');
      return;
    }
    if (!user.name || !user.phone) {
      alert('Please enter your name and phone number');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    // Get logged in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const orderData = {
      customer_name: user.name,
      phone: user.phone,
      total: calculateTotal(),
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      created_at: new Date().toISOString(),
      username: loggedInUser ? loggedInUser.username : undefined,
    };
    setOrdering(true);
    fetch('http://127.0.0.1:8000/create_order/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Order submission failed');
        return res.json();
      })
      .then((data) => {
        setReceipt(data.receipt || null); // Save receipt from backend
        // Save receipt for user if logged in
        saveReceiptForUser(data);
        setCart([]);
        setUser({ name: '', phone: '' });
        localStorage.removeItem('cart');
        localStorage.removeItem('orderUser');
        setPollingActive(true); // Start polling after order placed
      })
      .catch((err) => {
        console.error(err);
        alert('Something went wrong. Please try again.');
      })
      .finally(() => setOrdering(false));
  };
  // Poll for order status after placing order
  useEffect(() => {
    let intervalId;
    if (pollingActive && user.phone) {
      intervalId = setInterval(() => {
        fetch(`http://127.0.0.1:8000/latest_order_status/?phone=${user.phone}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              setOrderStatus(data.status);
              if (data.status === "Received") {
                setShowNotification(true);
                setPollingActive(false);
                clearInterval(intervalId);
              }
            }
          })
          .catch(() => {});
      }, 5000); // Poll every 5 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingActive, user.phone]);

  // Use React Router to control modal visibility
  const navigate = useNavigate();

  // Show receipts modal if requested
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Receipts Modal */}
        {showReceiptsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              padding: '2rem',
              maxWidth: '600px',
              width: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}>
              <button
                className="btn btn-close position-absolute end-0 top-0 m-2"
                onClick={() => setShowReceiptsModal(false)}
                aria-label="Close Receipts"
              ></button>
              <h3 className="mb-3">Your Past Receipts</h3>
              {userReceipts.length === 0 ? (
                <p>No past receipts found.</p>
              ) : (
                <ul className="list-group mb-3">
                  {userReceipts.map((r, idx) => (
                    <li className="list-group-item" key={idx}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          <strong>Date:</strong> {new Date(r.date).toLocaleString()}
                        </span>
                        {r.receipt_url && (
                          <a
                            className="btn btn-sm btn-success ms-2"
                            href={r.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download
                          </a>
                        )}
                      </div>
                      <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95em', marginTop: 8}}>{r.receipt}</pre>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {showNotification && (
          <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-4" style={{zIndex: 99999}}>
            Order received!
          </div>
        )}
        <button
          className="btn btn-close position-absolute end-0 top-0 m-3"
          onClick={() => navigate(-1)}
          aria-label="Close"
        ></button>
        {/* Cart Icon Button */}
        <div style={{ position: 'absolute', top: 24, left: 32, zIndex: 10000 }}>
          <button
            className="btn btn-light position-relative"
            style={{ fontSize: '1.8rem', borderRadius: '50%', padding: '0.5rem 0.7rem' }}
            onClick={() => setShowCart(true)}
            aria-label="View Cart"
          >
            <FaShoppingCart />
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                minWidth: '24px',
                textAlign: 'center',
              }}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </button>
        </div>
        <section className="container mt-2">
          <h2 className="mb-4 text-center">Menu</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : (
            <>
              {/* Category Tabs */}
              <div className="mb-3 d-flex justify-content-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    className={`btn ${selectedCategory === cat.key ? 'btn-primary' : 'btn-outline-primary'}`}
                    style={{ minWidth: 120 }}
                    onClick={() => setSelectedCategory(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="menu-scroll-container mb-4">
                <div className="menu-scroll">
                  {items.filter(item => item.category === selectedCategory).length === 0 ? (
                    <div className="text-center w-100 text-muted">No items in this category.</div>
                  ) : (
                    items.filter(item => item.category === selectedCategory).map((item) => (
                      <div className="card menu-card me-3" key={item.id}>
                        {item.image && (
                          <img
                            src={`http://127.0.0.1:8000${item.image}`}
                            className="card-img-top"
                            alt={item.name}
                            style={{ height: '180px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body">
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text">{item.description}</p>
                          <p className="card-text">Price: {item.price} UGX</p>
                          <div className="d-flex align-items-center">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="form-control"
                              style={{ width: '70px' }}
                            />
                            <button
                              className="btn btn-success ms-2"
                              onClick={() => handleAddToCart(item)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Cart Modal Popup */}
              {showCart && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 10001,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '95vw',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                  }}>
                    <button
                      className="btn btn-close position-absolute end-0 top-0 m-2"
                      onClick={() => setShowCart(false)}
                      aria-label="Close Cart"
                    ></button>
                    <h3 className="mb-3">Your Cart</h3>
                    {receipt ? (
                      <div className="alert alert-success mb-3">
                        <strong>Receipt:</strong><br />
                        {receipt.receipt ? (
                          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{receipt.receipt}</pre>
                        ) : (
                          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{receipt}</pre>
                        )}
                        {receipt.receipt_url && (
                          <a
                            className="btn btn-success mt-2"
                            href={receipt.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download Receipt
                          </a>
                        )}
                        <button
                          className="btn btn-secondary mt-3 ms-2"
                          onClick={() => setReceipt(null)}
                        >
                          New Order
                        </button>
                      </div>
                    ) : cart.length === 0 ? (
                      <p>No items in cart.</p>
                    ) : (
                      <>
                        <ul className="list-group mb-3">
                          {cart.map((item) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                              <span>
                                {item.name} × {item.quantity} = {item.price * item.quantity} UGX
                              </span>
                              <span>
                                <button
                                  className="btn btn-sm btn-warning me-2"
                                  onClick={() => {
                                    const newQty = prompt('Edit quantity:', item.quantity);
                                    if (newQty !== null && !isNaN(newQty) && Number(newQty) > 0) {
                                      setCart((prev) => prev.map((c) => c.id === item.id ? { ...c, quantity: Number(newQty) } : c));
                                    }
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setCart((prev) => prev.filter((c) => c.id !== item.id))}
                                >
                                  Delete
                                </button>
                              </span>
                            </li>
                          ))}
                          <li className="list-group-item fw-bold">
                            Total: {calculateTotal()} UGX
                          </li>
                        </ul>
                        <div className="mb-3">
                          {/* View Past Receipts Button for logged-in users */}
                          {isAuthenticated && (
                            <button
                              className="btn btn-outline-primary w-100 mb-2"
                              onClick={() => {
                                loadUserReceipts();
                                setShowReceiptsModal(true);
                              }}
                            >
                              View Past Receipts
                            </button>
                          )}
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Your Name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                          />
                          <input
                            type="tel"
                            className="form-control mb-2"
                            placeholder="Phone Number"
                            value={user.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          />
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Location (e.g. address, area)"
                            value={user.location || ''}
                            onChange={e => setUser({ ...user, location: e.target.value })}
                          />
                          <select
                            className="form-control mb-3"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option value="Cash">Cash</option>
                            <option value="Mobile Money">Mobile Money</option>
                            <option value="Card">Card</option>
                          </select>
                          {!isAuthenticated ? (
                            <button
                              className="btn btn-warning w-100 mb-2"
                              onClick={() => navigate('/login')}
                            >
                              Log In
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary mb-2"
                                onClick={handleOrder}
                                disabled={ordering}
                              >
                                {ordering ? 'Sending Order...' : 'Order'}
                              </button>
                              <button
                                className="btn btn-danger w-100 mb-2"
                                onClick={handleLogout}
                              >
                                Logout
                              </button>
                            </>
                          )}
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [{
                                  amount: {
                                    value: calculateTotal().toString(), // Total price in USD
                                  },
                                }],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order.capture().then((details) => {
                                alert('Payment completed by ' + details.payer.name.given_name);
                                // You can now send order details to your backend
                              });
                            }}
                          />
                          <button
                            className="btn btn-outline-danger w-100 mt-3"
                            onClick={() => {
                              setCart([]);
                              setUser({ name: '', phone: '' });
                              setPaymentMethod('Cash');
                            }}
                          >
                            Undo Order
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        <button
          className="btn btn-secondary w-100 mt-4"
          onClick={() => navigate(-1)}
        >
          Close Menu
        </button>
      </div>
    </div>
  );
};

export default Menu;
