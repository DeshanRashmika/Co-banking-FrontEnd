import { useState, useEffect } from 'react';
import { investmentAPI } from '../services/api';

export default function Investments() {
  const [portfolio, setPortfolio] = useState(null);
  const [investmentForm, setInvestmentForm] = useState({
    symbol: '',
    shares: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await investmentAPI.getPortfolio();
        setPortfolio(res.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      await investmentAPI.buyInvestment({
        symbol: investmentForm.symbol,
        shares: Number.parseInt(investmentForm.shares, 10),
      });
      setMessage('Investment purchased successfully!');
      setInvestmentForm({ symbol: '', shares: '' });

      const res = await investmentAPI.getPortfolio();
      setPortfolio(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSell = async (investmentId) => {
    if (!window.confirm('Are you sure you want to sell this investment?')) return;

    try {
      await investmentAPI.sellInvestment(investmentId);
      setMessage('Investment sold successfully!');
      const res = await investmentAPI.getPortfolio();
      setPortfolio(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sale failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary">Investment Portfolio</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-primary mb-6">Buy Investment</h2>
              <form onSubmit={handleBuy} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    name="symbol"
                    value={investmentForm.symbol}
                    onChange={handleChange}
                    required
                    placeholder="e.g., AAPL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Number of Shares</label>
                  <input
                    type="number"
                    name="shares"
                    value={investmentForm.shares}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
                >
                  {submitting ? 'Purchasing...' : 'Buy'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-primary mb-6">Your Holdings</h2>
              {loading ? (
                <div className="text-center">Loading portfolio...</div>
              ) : portfolio && portfolio.holdings && portfolio.holdings.length > 0 ? (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">
                      <span className="font-semibold">Portfolio Value:</span> ${portfolio.totalValue?.toFixed(2)}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Symbol</th>
                          <th className="px-4 py-2 text-left font-semibold">Shares</th>
                          <th className="px-4 py-2 text-left font-semibold">Price</th>
                          <th className="px-4 py-2 text-left font-semibold">Value</th>
                          <th className="px-4 py-2 text-left font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.holdings.map((holding) => (
                          <tr key={holding.id} className="border-t">
                            <td className="px-4 py-3 font-semibold">{holding.symbol}</td>
                            <td className="px-4 py-3">{holding.shares}</td>
                            <td className="px-4 py-3">${holding.currentPrice?.toFixed(2)}</td>
                            <td className="px-4 py-3 font-semibold">${(holding.shares * holding.currentPrice)?.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleSell(holding.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                              >
                                Sell
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">No investments yet</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
