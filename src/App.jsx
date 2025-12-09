import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact us';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import RoleSelection from './components/pages/RoleSelection';
import FarmerVerification from './components/pages/FarmerVerification';

import SuperAdminDashboard from './components/dashboards/admin/SuperAdminDashboard';
import FarmerDashboard from './components/dashboards/FarmerDashboard';
import MerchantDashboard from './components/dashboards/MerchantDashboard';
import MerchantAdminDashboard from './components/dashboards/merchant-admin/MerchantAdminDashboard';
import OrderAdmin from './components/dashboards/Order Admin';
import FinanceAdmin from './components/dashboards/FinanceAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <div className="App bg-d">
      <Routes>
        {/* Landing Page Routes */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/about" element={
          <>
            <Header />
            <About />
            <Footer />
          </>
        } />
        
        <Route path="/contact" element={
          <>
            <Header />
            <Contact />
            <Footer />
          </>
        } />
        
        <Route path="/login" element={
          <>
            <Header />
            <Login />
            <Footer />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <Header />
            <SignUp />
            <Footer />
          </>
        } />
        
        <Route path="/role-selection" element={
          <>
            <Header />
            <RoleSelection />
            <Footer />
          </>
        } />
        
        <Route path="/farmer-verification" element={
          <>
            <Header />
            <FarmerVerification />
            <Footer />
          </>
        } />
        
        {/* Admin Routes - Now handled by regular Login page */}
        
        {/* Dashboard Routes */}
        <Route path="/farmer-dashboard" element={
          <ProtectedRoute requiredRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/merchant-dashboard" element={
          <ProtectedRoute requiredRole="merchant">
            <MerchantDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/merchant-dashboard/softpro" element={
          <ProtectedRoute requiredRole="merchant">
            <MerchantAdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/super-admin" element={
          <ProtectedRoute requiredRole="admin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Temporary route for initial setup - remove after first admin is created */}
        <Route path="/setup" element={<SuperAdminDashboard />} />
        
        <Route path="/order-admin" element={
          <ProtectedRoute requiredRole="Order Admin">
            <OrderAdmin />
          </ProtectedRoute>
        } />
        
        <Route path="/finance-admin" element={
          <ProtectedRoute requiredRole="Finance Admin">
            <FinanceAdmin />
          </ProtectedRoute>
        } />
        
        <Route path="/product-admin" element={
          <ProtectedRoute requiredRole="Product Admin">
            <div>Product Admin Dashboard - Coming Soon</div>
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
