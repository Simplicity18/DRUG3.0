import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

export default function StockTracking() {
  const [drugs, setDrugs] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/drugs'),
      api.get('/reports/movements?limit=50')
    ]).then(([dr, mv]) => {
      setDrugs(dr.data);
      setMovements(mv.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleString();
  const isExpiringSoon = (exp) => {
    const expD = new Date(exp);
    const now = new Date();
    const diff = (expD - now) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  };
  const isExpired = (exp) => new Date(exp) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const lowStock = drugs.filter(d => d.quantity <= d.reorderLevel);
  const expiring = drugs.filter(d => isExpiringSoon(d.expiryDate) || isExpired(d.expiryDate));

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-400" /> Low Stock Alerts
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {lowStock.length === 0 ? (
              <p className="text-gray-500">No low stock items</p>
            ) : (
              lowStock.map(d => (
                <div key={d._id} className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span>{d.name}</span>
                  <span className="text-amber-400">{d.quantity} / {d.reorderLevel}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-red-400" /> Expiry Tracking (Red: &lt;30 days)
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {expiring.length === 0 ? (
              <p className="text-gray-500">No expiring items</p>
            ) : (
              expiring.map(d => (
                <div
                  key={d._id}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isExpired(d.expiryDate)
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  <span>{d.name}</span>
                  <span className={isExpired(d.expiryDate) ? 'text-red-400' : 'text-orange-400'}>
                    {formatDate(d.expiryDate).split(',')[0]}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <h3 className="text-lg font-semibold p-6 border-b border-white/10">Real-time Stock Movement History</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-medium">Drug</th>
                <th className="text-left p-4 text-gray-400 font-medium">Batch</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Quantity</th>
                <th className="text-left p-4 text-gray-400 font-medium">Prev → New</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">{m.drugName}</td>
                  <td className="p-4">{m.batchNumber}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      m.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400' :
                      m.type === 'SALE' || m.type === 'OUT' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{m.type}</span>
                  </td>
                  <td className={`p-4 ${m.quantity < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{m.quantity}</td>
                  <td className="p-4 text-gray-400">{m.previousQuantity} → {m.newQuantity}</td>
                  <td className="p-4 text-sm text-gray-500">{formatDate(m.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
