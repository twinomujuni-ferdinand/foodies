import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRegistration = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Login logic: POST to backend
      try {
        const res = await fetch('http://127.0.0.1:8000/login_user/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password })
        });
        const data = await res.json();
        if (res.ok) {
          setMessage('Login successful!');
          // Store user info in localStorage for persistent authentication
          localStorage.setItem('user', JSON.stringify({ username: form.username }));
          localStorage.setItem('loginTime', Date.now().toString());
          if (setUser) setUser({ username: form.username });
          // If cart exists and has items, go to menu, else go to home
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          if (cart && cart.length > 0) {
            window.location.href = '/menu';
          } else {
            window.location.href = '/';
          }
        } else {
          setMessage(data.error || 'Login failed');
        }
      } catch (err) {
        setMessage('Login error');
      }
    } else {
      // Registration logic: POST to backend
      try {
        const res = await fetch('http://127.0.0.1:8000/register_user/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password, email: form.email })
        });
        const data = await res.json();
        if (res.ok) {
          setMessage('Registration successful! You can now log in.');
          setIsLogin(true);
        } else {
          setMessage(data.error || 'Registration failed');
        }
      } catch (err) {
        setMessage('Registration error');
      }
    }
  };

  const isLoggedIn = !!localStorage.getItem('user');

  const navigate = useNavigate();
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400, margin: 'auto', position: 'relative' }}>
        <button
          className="btn btn-close position-absolute end-0 top-0 m-3"
          onClick={() => navigate(-1)}
          aria-label="Close"
        ></button>
        <h3 className="card-title text-center mb-4">{isLogin ? 'Login' : 'Register'}</h3>
        {!isLoggedIn ? (
          <>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <div className="text-center mt-3">
              <button
                className="btn btn-link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="alert alert-success mb-3">You are logged in as {JSON.parse(localStorage.getItem('user')).username}.</div>
            <button
              className="btn btn-danger w-100"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('loginTime');
                localStorage.setItem('logoutTime', Date.now().toString());
                setMessage('Logged out successfully.');
                window.location.reload();
              }}
            >
              Log Out
            </button>
          </>
        )}
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default LoginRegistration;