import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCalculator } from 'react-icons/fi';

export default function EOQCalculator() {
  const [inputs, setInputs] = useState({ annualDemand: '', orderingCost: '', holdingCost: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/eoq/calculate', inputs);
      setResult(data);
      toast.success('EOQ calculated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid inputs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FiCalculator /> Economic Order Quantity (EOQ)
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          EOQ = √((2DS)/H) — D: Annual demand, S: Ordering cost, H: Holding cost
        </p>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Annual Demand (D)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={inputs.annualDemand}
              onChange={(e) => setInputs(i => ({ ...i, annualDemand: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary-500 outline-none"
              placeholder="e.g. 1200"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ordering Cost (S) — ₹ per order</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.orderingCost}
              onChange={(e) => setInputs(i => ({ ...i, orderingCost: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary-500 outline-none"
              placeholder="e.g. 50"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Holding Cost (H) — ₹ per unit per year</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.holdingCost}
              onChange={(e) => setInputs(i => ({ ...i, holdingCost: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary-500 outline-none"
              placeholder="e.g. 5"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate EOQ'}
          </button>
        </form>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-primary-500/20"
        >
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <div className="grid gap-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-primary-500/10">
              <span>EOQ (Optimal Order Quantity)</span>
              <span className="text-xl font-bold text-primary-400">{result.eoq} units</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <span>Number of Orders per Year</span>
              <span>{result.numberOfOrdersPerYear}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <span>Time Between Orders (days)</span>
              <span>{result.timeBetweenOrdersDays} days</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
