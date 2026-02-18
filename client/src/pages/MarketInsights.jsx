import { motion } from 'framer-motion';

export default function MarketInsights() {
  const insights = [
    { label: 'Market Size (2025)', value: '$6.4B', sub: 'Projected' },
    { label: 'Market Size (2030)', value: '$10B', sub: 'Growth' },
    { label: 'CAGR', value: '9%', sub: 'Annual growth rate' },
  ];
  const players = ['Omnicell', 'BD', 'McKesson'];
  const trends = [
    'AI-driven demand forecasting',
    'Cloud-based inventory systems',
    'Automated dispensing cabinets',
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Pharmacy & Drug Inventory Market Insights</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {insights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-primary-500/10 border border-primary-500/20"
            >
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className="text-3xl font-bold text-primary-400 mt-1">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Key Players</h3>
            <ul className="space-y-2">
              {players.map((p, i) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs text-primary-400">{i + 1}</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
            <ul className="space-y-2">
              {trends.map((t, i) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 text-gray-400 text-sm"
      >
        <p>Source: Industry reports on pharmacy inventory management systems. Data indicative for educational purposes.</p>
      </motion.div>
    </div>
  );
}
