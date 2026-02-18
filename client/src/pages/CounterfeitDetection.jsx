import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiShield } from 'react-icons/fi';

export default function CounterfeitDetection() {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/qr/verify', { barcodeQR: barcode });
      setResult(data);
      toast.success('Verification complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
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
          <FiShield /> QR / Barcode Verification (Placeholder Module)
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Simulated verification — enter a barcode to check Authentic / Suspicious status.
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Barcode / QR Code</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary-500 outline-none"
              placeholder="e.g. PARA001, AMOX002"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Try: PARA001, AMOX002, IBUP003 (from seed data) — found in DB = Authentic
        </p>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-2xl p-6 border ${
            result.status === 'Authentic'
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Verification Result</h3>
          <div className="space-y-3">
            <p>
              <span className="text-gray-400">Status:</span>{' '}
              <span className={result.status === 'Authentic' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {result.status}
              </span>
            </p>
            {result.drugInfo && (
              <div className="mt-4 p-4 rounded-xl bg-white/5">
                <p><span className="text-gray-400">Name:</span> {result.drugInfo.name}</p>
                <p><span className="text-gray-400">Batch:</span> {result.drugInfo.batchNumber}</p>
                <p><span className="text-gray-400">Manufacturer:</span> {result.drugInfo.manufacturer}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
