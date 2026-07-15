import { useState, useEffect } from 'react';
import { investmentAPI, accountAPI } from '../services/api';
import { FiTrendingUp, FiPieChart, FiShoppingBag, FiArrowUpRight, FiSearch, FiChevronDown } from 'react-icons/fi';
import InvestmentsChart from '../components/InvestmentsChart';

export default function Investments() {
  const [portfolio, setPortfolio] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [investmentForm, setInvestmentForm] = useState({
    symbol: '',
    shares: '',
    accountId: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const marketPrice = investmentForm.symbol ? (investmentForm.symbol.length * 15.75) + 50 : 0;
  const activeAccountId = investmentForm.accountId || (accounts.length > 0 ? accounts[0].id : '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, accountsRes] = await Promise.all([
          investmentAPI.getPortfolio(),
          accountAPI.getAccounts(),
        ]);
        setPortfolio(portfolioRes.data);
        setAccounts(accountsRes.data || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

    const shares = Number.parseInt(investmentForm.shares, 10);
    if (Number.isNaN(shares) || shares <= 0) {
      setError('Please enter a valid number of shares greater than zero.');
      return;
    }

    const totalCost = shares * marketPrice;
    const finalAccountId = activeAccountId;
    const selectedAccount = accounts.find(a => a.id === finalAccountId);

    if (selectedAccount && totalCost > selectedAccount.balance) {
      const selectedName = selectedAccount.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account';
      setError(`Insufficient funds in ${selectedName}. Required: $${totalCost.toFixed(2)}, Available: $${selectedAccount.balance.toFixed(2)}`);
      return;
    }

    setSubmitting(true);

    try {
      await investmentAPI.buyInvestment({
        symbol: investmentForm.symbol.toUpperCase(),
        shares: shares,
        accountId: finalAccountId,
        price: marketPrice,
      });
      
      setMessage(`Successfully purchased ${shares} shares of ${investmentForm.symbol.toUpperCase()}`);
      setInvestmentForm({ symbol: '', shares: '', accountId: finalAccountId });

      const [portfolioRes, accountsRes] = await Promise.all([
        investmentAPI.getPortfolio(),
        accountAPI.getAccounts(),
      ]);
      setPortfolio(portfolioRes.data);
      setAccounts(accountsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please check your balance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSell = async (holding) => {
    if (!window.confirm(`Are you sure you want to sell your ${holding.shares} shares of ${holding.symbol}?`)) return;

    try {
      await investmentAPI.sellInvestment(holding.id, {
        shares: holding.shares,
        sellPrice: holding.currentPrice
      });
      setMessage(`Successfully sold all shares of ${holding.symbol}`);
      const res = await investmentAPI.getPortfolio();
      setPortfolio(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sale failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black pb-12">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Investments</h1>
          <p className="text-gray-500 mt-2 text-lg">Build and manage your global asset portfolio.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-gray-900 text-white p-4 mb-8 rounded-2xl flex items-center gap-3">
            <FiArrowUpRight className="shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black text-white p-8 rounded-4xl shadow-xl">
                <p className="text-gray-400 font-medium mb-1">Total Portfolio Value</p>
                <h2 className="text-4xl font-bold tracking-tighter">${portfolio?.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                <div className="mt-6 flex items-center gap-2 text-green-400 font-bold">
                  <FiTrendingUp />
                  <span>+12.5% this month</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Active Positions</p>
                  <h2 className="text-3xl font-bold">{portfolio?.holdings?.length || 0} Assets</h2>
                </div>
                <div className="flex -space-x-3 mt-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                      {['AAPL', 'TSLA', 'BTC', 'ETH'][i-1]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 overflow-hidden">
              <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="text-xl font-bold">Your Holdings</h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search assets..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-black" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                      <th className="px-4 py-4">Asset</th>
                      <th className="px-4 py-4">Shares</th>
                      <th className="px-4 py-4">Current Price</th>
                      <th className="px-4 py-4">Total Value</th>
                      <th className="px-4 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {portfolio?.holdings?.map((holding) => (
                      <tr key={holding.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xs">
                              {holding.symbol[0]}
                            </div>
                            <span className="font-bold">{holding.symbol}</span>
                          </div>
                        </td>
                        <td className="px-4 py-6 font-medium">{holding.shares}</td>
                        <td className="px-4 py-6 font-medium">${holding.currentPrice?.toFixed(2)}</td>
                        <td className="px-4 py-6">
                          <p className="font-bold">${(holding.shares * holding.currentPrice)?.toFixed(2)}</p>
                        </td>
                        <td className="px-4 py-6 text-right">
                          <button
                            onClick={() => handleSell(holding)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black hover:text-white transition-all shadow-sm"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!portfolio?.holdings || portfolio.holdings.length === 0) && (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-gray-400">
                          <FiPieChart className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p>No investments found. Start trading on the right.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Portfolio Distribution</h3>
              </div>
              <InvestmentsChart holdings={portfolio?.holdings || []} />
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-black rounded-2xl text-white">
                  <FiShoppingBag />
                </div>
                <h3 className="text-xl font-bold">Quick Trade</h3>
              </div>

              <form onSubmit={handleBuy} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="investment-account" className="text-xs font-bold uppercase tracking-widest text-gray-400">Pay From Account</label>
                  <div className="relative">
                    <select
                      id="investment-account"
                      name="accountId"
                      value={investmentForm.accountId || activeAccountId}
                      onChange={handleChange}
                      required
                      className="w-full px-6 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-black appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">Select account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.accountType === 'SAVINGS' ? 'Savings Account' : 'Checking Account'} (${acc.balance?.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="stock-symbol" className="text-xs font-bold uppercase tracking-widest text-gray-400">Stock Symbol</label>
                  <input
                    id="stock-symbol"
                    type="text"
                    name="symbol"
                    value={investmentForm.symbol}
                    onChange={handleChange}
                    required
                    placeholder="e.g. AAPL, BTC, TSLA"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="share-count" className="text-xs font-bold uppercase tracking-widest text-gray-400">Number of Shares</label>
                  <input
                    id="share-count"
                    type="number"
                    name="shares"
                    value={investmentForm.shares}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-black transition-colors"
                    placeholder="0"
                  />
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Market Price</span>
                    <span>${marketPrice > 0 ? marketPrice.toFixed(2) : '--.--'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3">
                    <span>Est. Total</span>
                    <span>${(Number(investmentForm.shares) * marketPrice) > 0 ? (Number(investmentForm.shares) * marketPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '--.--'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !investmentForm.symbol || !investmentForm.shares}
                  className="w-full bg-black text-white font-bold py-5 rounded-2xl text-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {submitting ? 'Executing Trade...' : 'Execute Buy'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-xs text-center text-gray-400 leading-relaxed italic">
                  Investing involves risk. Ensure you've read our <span className="underline cursor-pointer">Risk Disclosure</span> before trading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}