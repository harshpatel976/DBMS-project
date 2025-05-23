import { Routes, Route } from 'react-router-dom';
import Navbar from './component/header/Header';
import Login from './component/login/Login';
import Register from './component/register/Register';
import ProtectedRoute from './component/context/ProtectedRoutes';
import Dashboard from './component/dashboard/DashBoard';
import Menu from './component/menu/Menu';
import Orders from './component/order/Order';
import Inventory from './component/inventory/Inventory';
import MenuManagement from './component/menu/Menumanagement';

import StaffOrders from './component/order/Stafforder';
import StudentTotalOrders from './component/order/Totalamount';


function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
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
        <Route
          path="/totalamount"
          element={
            <ProtectedRoute>
              <StudentTotalOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute staffOnly>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stafforder"
          element={
            <ProtectedRoute staffOnly>
              <StaffOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu-management"
          element={
            <ProtectedRoute staffOnly>
              <MenuManagement />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;