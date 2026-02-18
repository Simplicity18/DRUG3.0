import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DrugManagement from './pages/DrugManagement';
import StockTracking from './pages/StockTracking';
import Reports from './pages/Reports';
import MarketInsights from './pages/MarketInsights';
import EOQCalculator from './pages/EOQCalculator';
import CounterfeitDetection from './pages/CounterfeitDetection';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="drugs" element={<DrugManagement />} />
        <Route path="stock" element={<StockTracking />} />
        <Route path="reports" element={<Reports />} />
        <Route path="market-insights" element={<MarketInsights />} />
        <Route path="eoq" element={<EOQCalculator />} />
        <Route path="counterfeit" element={<CounterfeitDetection />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
