'use client';
import StepProgressBar from '@/components/stepprogessbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PaymentMethod = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    codMobile: '',
    codAddress: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (selectedMethod) {
      router.push('/checkout/complete');
    }
  };

  return (
    <>
    <StepProgressBar></StepProgressBar>
      <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Select Payment Method</h2>

        <form className="space-y-4">
          {['Credit Card', 'UPI', 'Cash on Delivery'].map((method) => (
            <div
              key={method}
              className={`flex items-center border rounded px-4 py-2 cursor-pointer ${selectedMethod === method ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                }`}
              onClick={() => setSelectedMethod(method)}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={selectedMethod === method}
                onChange={() => setSelectedMethod(method)}
                className="mr-3 accent-purple-600"
              />
              <span className="text-lg">{method}</span>
            </div>
          ))}

          {selectedMethod === 'Credit Card' && (
            <div className="space-y-4 pt-4">
              <input
                type="text"
                name="cardName"
                placeholder="Cardholder Name"
                className="w-full border border-gray-300 rounded px-4 py-2"
                onChange={handleInput}
                value={formData.cardName}
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                className="w-full border border-gray-300 rounded px-4 py-2"
                onChange={handleInput}
                value={formData.cardNumber}
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  className="w-1/2 border border-gray-300 rounded px-4 py-2"
                  onChange={handleInput}
                  value={formData.expiry}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  className="w-1/2 border border-gray-300 rounded px-4 py-2"
                  onChange={handleInput}
                  value={formData.cvv}
                />
              </div>
            </div>
          )}

          {selectedMethod === 'UPI' && (
            <div className="pt-4">
              <input
                type="text"
                name="upiId"
                placeholder="Enter your UPI ID (e.g. name@bank)"
                className="w-full border border-gray-300 rounded px-4 py-2"
                onChange={handleInput}
                value={formData.upiId}
              />
            </div>
          )}

          {selectedMethod === 'Cash on Delivery' && (
            <div className="space-y-4 pt-4">
              <input
                type="text"
                name="codMobile"
                placeholder="Mobile Number"
                className="w-full border border-gray-300 rounded px-4 py-2"
                onChange={handleInput}
                value={formData.codMobile}
              />
              <input
                type="text"
                name="codAddress"
                placeholder="Delivery Address"
                className="w-full border border-gray-300 rounded px-4 py-2"
                onChange={handleInput}
                value={formData.codAddress}
              />
            </div>
          )}

          <button
            type="button"
            disabled={!selectedMethod}
            className={`w-full mt-6 py-2 text-white font-semibold rounded ${selectedMethod
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
            onClick={handleSubmit}
          >
            {selectedMethod === 'Credit Card'
              ? 'Pay with Card'
              : selectedMethod === 'UPI'
                ? 'Pay with UPI'
                : 'Place COD Order'}
          </button>
        </form>
      </div>
    </>

  );
};

export default PaymentMethod;
