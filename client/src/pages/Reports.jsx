import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FiDownload, FiPrinter } from 'react-icons/fi';

export default function Reports() {
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get('/reports/stock'),
      api.get('/reports/movements?limit=200')
    ]).then(([s, m]) => {
      setStock(s.data);
      setMovements(m.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExportCSV = async () => {
    try {
      const { data } = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    const token = localStorage.getItem('token');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Inventory Report</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #1e293b; color: white; }
      </style></head><body>
      <h1>Drug Inventory Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <h2>Available Stock by Name</h2>
      <table>
        <tr><th>Name</th><th>Batch</th><th>Manufacturer</th><th>Expiry</th><th>Quantity</th><th>Cost</th><th>Selling Price</th></tr>
        ${stock.map(d => `
          <tr>
            <td>${d.name}</td><td>${d.batchNumber}</td><td>${d.manufacturer}</td>
            <td>${new Date(d.expiryDate).toLocaleDateString()}</td><td>${d.quantity}</td>
            <td>₹${d.costPrice}</td><td>₹${d.sellingPrice}</td>
          </tr>
        `).join('')}
      </table>
      <h2>Stock Movement History</h2>
      <table>
        <tr><th>Drug</th><th>Batch</th><th>Type</th><th>Quantity</th><th>Date</th></tr>
        ${movements.slice(0, 50).map(m => `
          <tr>
            <td>${m.drugName}</td><td>${m.batchNumber}</td><td>${m.type}</td>
            <td>${m.quantity}</td><td>${new Date(m.date).toLocaleString()}</td>
          </tr>
        `).join('')}
      </table>
      <p>Project by Ansh Kumar | Guide: Dr. Ajit | Reg: 2427030307</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const formatDate = (d) => new Date(d).toLocaleString();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" ref={printRef}>
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
        >
          <FiDownload /> Export to CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:bg-white/10"
        >
          <FiPrinter /> Printable Report
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <h3 className="text-lg font-semibold p-6 border-b border-white/10">Available Stock by Name</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Batch</th>
                <th className="text-left p-4 text-gray-400 font-medium">Manufacturer</th>
                <th className="text-left p-4 text-gray-400 font-medium">Expiry</th>
                <th className="text-left p-4 text-gray-400 font-medium">Quantity</th>
                <th className="text-left p-4 text-gray-400 font-medium">Cost</th>
                <th className="text-left p-4 text-gray-400 font-medium">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {stock.map(d => (
                <tr key={d._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">{d.name}</td>
                  <td className="p-4">{d.batchNumber}</td>
                  <td className="p-4">{d.manufacturer}</td>
                  <td className="p-4">{new Date(d.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4">{d.quantity}</td>
                  <td className="p-4">₹{d.costPrice}</td>
                  <td className="p-4">₹{d.sellingPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <h3 className="text-lg font-semibold p-6 border-b border-white/10">Stock Movement History</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-medium">Drug</th>
                <th className="text-left p-4 text-gray-400 font-medium">Batch</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Quantity</th>
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
                      m.type === 'IN' ? 'bg-emerald-500/20' : m.type === 'SALE' ? 'bg-red-500/20' : 'bg-amber-500/20'
                    }`}>{m.type}</span>
                  </td>
                  <td className="p-4">{m.quantity}</td>
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
