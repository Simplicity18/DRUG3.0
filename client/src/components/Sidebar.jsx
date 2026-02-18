import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiLayout,
  FiPackage,
  FiTrendingUp,
  FiFileText,
  FiBarChart2,
  FiCalculator,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: FiLayout, label: 'Dashboard' },
  { path: '/drugs', icon: FiPackage, label: 'Drug Management' },
  { path: '/stock', icon: FiTrendingUp, label: 'Stock Tracking' },
  { path: '/reports', icon: FiFileText, label: 'Reports' },
  { path: '/market-insights', icon: FiBarChart2, label: 'Market Insights' },
  { path: '/eoq', icon: FiCalculator, label: 'EOQ Calculator' },
  { path: '/counterfeit', icon: FiShield, label: 'Counterfeit Detection' },
];

export default function Sidebar({ onClose, mobile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <aside className={`w-64 min-h-screen glass border-r border-white/5 flex flex-col flex-shrink-0 ${mobile ? 'flex' : 'hidden md:flex'}`}>
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
          Drug Inventory
        </h2>
        <p className="text-xs text-gray-500 mt-1">Supply Chain Tracking</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                initial={false}
                animate={{ scale: isActive ? 1.05 : 1 }}
                className="flex items-center gap-3 w-full"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="px-4 py-2 text-xs text-gray-500">
          <p>Guide: Dr. Ajit</p>
          <p>Student: Ansh Kumar</p>
          <p>Reg: 2427030307</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
