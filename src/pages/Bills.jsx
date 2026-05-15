import { useState, useEffect } from 'react';
import { billPayAPI } from '../services/api';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
  });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await billPayAPI.getBills();
        setBills(res.data);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setPaying(true);

    try {
      await billPayAPI.payBill({
        billId: selectedBill.id,
        amount: Number.parseFloat(formData.amount),
      });
      setMessage('Bill paid successfully!');
      setSelectedBill(null);
      setFormData({ amount: '' });
      // Refresh bills
      const res = await billPayAPI.getBills();
      setBills(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  let billsContent;

  if (loading) {
    billsContent = <div className="p-6 text-center">Loading bills...</div>;
  } else if (bills.length > 0) {
    billsContent = (
      <div className="divide-y">
        {bills.map((bill) => (
          <button
            key={bill.id}
            type="button"
            onClick={() => handleSelectBill(bill)}
            className={`w-full text-left p-4 cursor-pointer hover:bg-gray-50 transition ${
              selectedBill?.id === bill.id ? 'bg-blue-50' : ''
            }`}
          >
            <h3 className="font-semibold text-gray-800">{bill.name}</h3>
            <p className="text-gray-600 text-sm">${bill.amount?.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-1">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
    );
  } else {
    billsContent = <div className="p-6 text-center text-gray-600">No bills available</div>;
  }

  const paymentContent = selectedBill ? (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Pay {selectedBill.name}</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Bill Amount:</span> ${selectedBill.amount?.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Due Date:</span> {new Date(selectedBill.dueDate).toLocaleDateString()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="payment-amount" className="block text-gray-700 font-semibold mb-2">Payment Amount</label>
          <input
            id="payment-amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            placeholder="Enter payment amount"
          />
        </div>

        <button
          type="submit"
          disabled={paying}
          className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400"
        >
          {paying ? 'Processing Payment...' : 'Pay Bill'}
        </button>
      </form>
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
      Select a bill to pay
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary">Pay Bills</h1>
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
          {/* Bills List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold text-primary p-6 border-b">Your Bills</h2>
              {billsContent}
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {paymentContent}
          </div>
        </div>
      </main>
    </div>
  );
}
