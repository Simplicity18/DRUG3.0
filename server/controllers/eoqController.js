// EOQ = √((2DS)/H)
// D = Annual demand, S = Ordering cost, H = Holding cost

exports.calculateEOQ = (req, res) => {
  try {
    const { annualDemand, orderingCost, holdingCost } = req.body;
    
    if (!annualDemand || !orderingCost || holdingCost === undefined) {
      return res.status(400).json({ message: 'Annual demand, ordering cost, and holding cost are required' });
    }

    const D = parseFloat(annualDemand);
    const S = parseFloat(orderingCost);
    const H = parseFloat(holdingCost);

    if (D <= 0 || S < 0 || H <= 0) {
      return res.status(400).json({ message: 'Values must be positive' });
    }

    const eoq = Math.sqrt((2 * D * S) / H);
    const numberOfOrders = D / eoq;
    const timeBetweenOrders = 365 / numberOfOrders;

    res.json({
      eoq: Math.round(eoq * 100) / 100,
      numberOfOrdersPerYear: Math.round(numberOfOrders * 100) / 100,
      timeBetweenOrdersDays: Math.round(timeBetweenOrders * 100) / 100,
      formula: 'EOQ = √((2DS)/H)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
