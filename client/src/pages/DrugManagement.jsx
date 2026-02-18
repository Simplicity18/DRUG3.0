import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export default function DrugManagement() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ expiry: '', lowStock: '', manufacturer: '', batchNumber: '' });
  const [modal, setModal] = useState(null);
  const [useFIFO, setUseFIFO] = useState(false);

  const fetchDrugs = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    api.get(`/drugs?${params}`).then(res => setDrugs(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrugs(); }, [search, filters]);

  const handleSave = async (data, id) => {
    try {
      if (id) await api.put(`/drugs/${id}`, data);
      else await api.post('/drugs', data);
      toast.success(id ? 'Drug updated' : 'Drug added');
      setModal(null);
      fetchDrugs();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this drug?')) return;
    try {
      await api.delete(`/drugs/${id}`);
      toast.success('Deleted');
      fetchDrugs();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleSell = async (drug, qty) => {
    try {
      await api.post('/drugs/sell', { drugId: drug._id, quantity: parseInt(qty), useFIFO });
      toast.success('Sale recorded');
      setModal(null);
      fetchDrugs();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Sale failed');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const isExpiringSoon = (d) => {
    const exp = new Date(d);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search drugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass border border-white/10 focus:border-primary-500 outline-none"
            />
          </div>
          <select
            value={filters.expiry}
            onChange={(e) => setFilters(f => ({ ...f, expiry: e.target.value }))}
            className="px-4 py-2 rounded-xl glass border border-white/10"
          >
            <option value="">All Expiry</option>
            <option value="soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filters.lowStock}
            onChange={(e) => setFilters(f => ({ ...f, lowStock: e.target.value }))}
            className="px-4 py-2 rounded-xl glass border border-white/10"
          >
            <option value="">All Stock</option>
            <option value="true">Low Stock</option>
          </select>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
        >
          <FiPlus /> Add Drug
        </button>
      </div>

      {filters.manufacturer && (
        <input
          placeholder="Filter by manufacturer"
          value={filters.manufacturer}
          onChange={(e) => setFilters(f => ({ ...f, manufacturer: e.target.value }))}
          className="px-4 py-2 rounded-xl glass border border-white/10 w-48"
        />
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Batch</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Manufacturer</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Expiry</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Qty</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Cost/Sell</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drugs.map((d) => (
                  <tr key={d._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">{d.name}</td>
                    <td className="p-4">{d.batchNumber}</td>
                    <td className="p-4">{d.manufacturer}</td>
                    <td className={`p-4 ${isExpiringSoon(d.expiryDate) ? 'text-red-400' : ''}`}>{formatDate(d.expiryDate)}</td>
                    <td className={`p-4 ${d.quantity <= d.reorderLevel ? 'text-amber-400' : ''}`}>{d.quantity}</td>
                    <td className="p-4">₹{d.costPrice} / ₹{d.sellingPrice}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => setModal({ mode: 'edit', drug: d })} className="p-2 rounded-lg hover:bg-white/10"><FiEdit2 /></button>
                      <button onClick={() => setModal({ mode: 'sell', drug: d })} className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400">Sell</button>
                      <button onClick={() => handleDelete(d._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span>Inventory logic:</span>
        <button
          onClick={() => setUseFIFO(false)}
          className={`px-3 py-1 rounded-lg ${!useFIFO ? 'bg-primary-500' : 'glass'}`}
        >
          FEFO (Default)
        </button>
        <button
          onClick={() => setUseFIFO(true)}
          className={`px-3 py-1 rounded-lg ${useFIFO ? 'bg-primary-500' : 'glass'}`}
        >
          FIFO
        </button>
      </div>

      <AnimatePresence>
        {modal && (
          <DrugModal
            modal={modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
            onSell={handleSell}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DrugModal({ modal, onClose, onSave, onSell }) {
  const [form, setForm] = useState(
    modal.drug
      ? { ...modal.drug, expiryDate: modal.drug.expiryDate?.slice(0, 10) }
      : { name: '', batchNumber: '', manufacturer: '', expiryDate: '', quantity: 0, costPrice: 0, sellingPrice: 0, reorderLevel: 10, barcodeQR: '' }
  );
  const [sellQty, setSellQty] = useState('');

  if (modal.mode === 'sell') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl p-6 w-full max-w-md"
        >
          <h3 className="text-lg font-semibold mb-4">Sell: {modal.drug.name}</h3>
          <p className="text-gray-400 text-sm mb-2">Available: {modal.drug.quantity}</p>
          <input
            type="number"
            min="1"
            max={modal.drug.quantity}
            value={sellQty}
            onChange={(e) => setSellQty(e.target.value)}
            className="w-full px-4 py-2 rounded-xl glass border border-white/10 mb-4"
          />
          <div className="flex gap-2">
            <button onClick={() => onSell(modal.drug, sellQty)} className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600">Confirm Sale</button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl glass">Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{modal.mode === 'add' ? 'Add Drug' : 'Edit Drug'}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><FiX /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form, modal.drug?._id); }}
          className="space-y-4"
        >
          {['name', 'batchNumber', 'manufacturer', 'barcodeQR'].map((key) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                value={form[key] || ''}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
                required={key !== 'barcodeQR'}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate || ''}
                onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={form.quantity ?? ''}
                onChange={(e) => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cost Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.costPrice ?? ''}
                onChange={(e) => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Selling Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.sellingPrice ?? ''}
                onChange={(e) => setForm(f => ({ ...f, sellingPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Reorder Level</label>
              <input
                type="number"
                min="0"
                value={form.reorderLevel ?? 10}
                onChange={(e) => setForm(f => ({ ...f, reorderLevel: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-xl glass border border-white/10"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button type="submit" className="flex-1 py-2 rounded-xl bg-primary-500 hover:bg-primary-600">Save</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl glass">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
