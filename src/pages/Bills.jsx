import { useState, useEffect } from 'react';
import { billPayAPI } from '../services/api';
import { FiCalendar, FiCheckCircle, FiCreditCard, FiDollarSign, FiZap } from 'react-icons/fi';
import { FaCcVisa, FaPaypal, FaCcMastercard } from 'react-icons/fa';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [formData, setFormData] = useState({
    amount: '',
  });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'visa', name: 'Visa •••• 4242', icon: <FaCcVisa className="w-6 h-6" /> },
    { id: 'paypal', name: 'PayPal (user@example.com)', icon: <FaPaypal className="w-5 h-5" /> },
    { id: 'mastercard', name: 'Mastercard •••• 8888', icon: <FaCcMastercard className="w-6 h-6" /> },
  ];

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await billPayAPI.getBills();
        setBills(res.data || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load bills');
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setFormData({ amount: bill.amount || '' });
    setMessage('');
    setError('');
    setShowConfirm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setMessage('');
  };

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const amount = Number.parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPayment = async () => {
    setPaying(true);
    setShowConfirm(false);

    try {
      await billPayAPI.payBill({
        billId: selectedBill.id,
        amount: Number.parseFloat(formData.amount),
        paymentMethod: selectedMethod,
      });
      setMessage(`Successfully paid ${selectedBill.name} using ${selectedMethod.toUpperCase()}`);
      setSelectedBill(null);
      setFormData({ amount: '' });
      
      const res = await billPayAPI.getBills();
      setBills(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
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
    <div className="min-h-screen bg-[#F9F9F9] pb-12 text-black">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Pay Bills</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage and pay your utility, service, and recurring bills.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-gray-900 text-white p-6 mb-8 rounded-3xl flex items-center gap-4 shadow-lg animate-in fade-in slide-in-from-top duration-500">
            <FiCheckCircle className="w-6 h-6 shrink-0" />
            <span className="font-medium text-lg">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Bills List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold mb-6 px-2">Upcoming Bills</h2>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <button
                  key={bill.id}
                  onClick={() => handleSelectBill(bill)}
                  className={`w-full text-left p-6 rounded-3xl transition-all duration-300 border ${
                    selectedBill?.id === bill.id 
                      ? 'bg-black text-white border-black shadow-xl scale-[1.02]' 
                      : 'bg-white text-black border-gray-100 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${selectedBill?.id === bill.id ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <FiZap className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-widest ${
                      selectedBill?.id === bill.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
                    }`}>Due</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{bill.name}</h3>
                  <div className="flex items-center gap-2 text-sm opacity-60">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-2xl font-bold mt-4">${bill.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </button>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                <FiCheckCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="text-gray-400">All caught up! No pending bills.</p>
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {selectedBill ? (
              <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-50 sticky top-8 relative overflow-hidden">
                {showConfirm && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center">
                      <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Confirm Payment</h3>
                      <p className="text-gray-500 mb-8">
                        You are about to pay <span className="text-black font-bold">${Number(formData.amount).toLocaleString()}</span> for your <span className="text-black font-bold">{selectedBill.name}</span>.
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => { setShowConfirm(false); setError(''); }}
                          className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleConfirmPayment}
                          className="flex-1 px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-8">Confirm Payment</h2>
                
                <form onSubmit={handleInitiateSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label htmlFor="bill-amount" className="text-sm font-bold uppercase tracking-wider text-gray-500">Payment Amount</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="bill-amount"
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                          step="0.01"
                          className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xl font-bold focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-bold uppercase tracking-wider text-gray-500">Scheduled Date</div>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          readOnly
                          value="Pay Now (Instant)"
                          className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <fieldset>
                      <legend className="text-sm font-bold uppercase tracking-wider text-gray-500 block mb-4">Select Payment Method</legend>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedMethod(method.id)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                              selectedMethod === method.id
                                ? 'border-black bg-black/5 ring-1 ring-black'
                                : 'border-gray-100 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className={selectedMethod === method.id ? 'text-black' : 'text-gray-400'}>
                              {method.icon}
                            </div>
                            <span className="text-xs font-bold text-center">{method.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  <div className="border-t border-gray-50 pt-8 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Charge</p>
                      <p className="text-3xl font-bold">${Number(formData.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button
                      type="submit"
                      disabled={paying}
                      className="bg-black text-white font-bold px-12 py-5 rounded-2xl text-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paying ? 'Processing...' : 'Complete Payment'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-20 text-center">
                <FiCreditCard className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-400">Select a bill from the list to continue</h3>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
