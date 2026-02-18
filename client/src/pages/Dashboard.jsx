import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { FiPackage, FiAlertTriangle, FiCalendar, FiDollarSign } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-6 glass-hover"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const salesChart = stats.salesByMonth?.map(s => ({
    name: monthNames[s._id - 1] || s._id,
    Sold: s.total,
  })) || [];
  const stockChart = stats.stockByDrug?.map(d => ({
    name: d.name?.slice(0, 12) + '...',
    Stock: d.quantity,
  })) || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiPackage} label="Total Drugs" value={stats.totalDrugs} color="bg-primary-500" />
        <StatCard icon={FiAlertTriangle} label="Low Stock Alerts" value={stats.lowStockCount} color="bg-amber-500" />
        <StatCard icon={FiCalendar} label="Expiring Soon (30d)" value={stats.expiringSoonCount} color="bg-orange-500" />
        <StatCard icon={FiDollarSign} label="Inventory Value" value={`₹${stats.totalInventoryValue?.toLocaleString() || 0}`} color="bg-emerald-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Consumption</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="Sold" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Stock by Drug (Top 10)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChart} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={75} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="Stock" fill="#a855f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4">Most Consumed Drugs</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.mostConsumedDrugs?.map((d, i) => (
            <div key={d._id} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-sm text-gray-400">#{i + 1}</p>
              <p className="font-medium truncate">{d.drugName}</p>
              <p className="text-primary-400">{d.totalSold} sold</p>
            </div>
          )) || <p className="text-gray-400">No sales data yet</p>}
          </div>
        </div>
        {stats.inventoryAccuracyPercent != null && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Inventory Accuracy</p>
            <p className="text-3xl font-bold text-primary-400">{stats.inventoryAccuracyPercent}%</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
