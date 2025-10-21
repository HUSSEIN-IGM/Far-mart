import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Animals from './pages/Animals';
import FarmerDashboard from './pages/FarmerDashboard';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

// Styles
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Farmer Only Route component
const FarmerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return isAuthenticated && user?.user_type === 'farmer' ? children : <Navigate to="/" />;
};

const AppContent = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animals" element={<Animals />} />
            <Route 
              path="/login" 
              element={!useSelector((state) => state.auth.isAuthenticated) ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!useSelector((state) => state.auth.isAuthenticated) ? <Register /> : <Navigate to="/" />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/farmer-dashboard" 
              element={
                <FarmerRoute>
                  <FarmerDashboard />
                </FarmerRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;