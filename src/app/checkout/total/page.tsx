'use client';

import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import StepProgressBar from '@/components/stepprogessbar';
import { useRouter } from 'next/navigation';

interface CheckoutData {
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  subtotalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  shippingPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
}

const CheckoutTotal: React.FC = () => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completeCheckoutLoading, setCompleteCheckoutLoading] = useState(false);
  const [completeCheckoutError, setCompleteCheckoutError] = useState('');
  const [completeCheckoutSuccess, setCompleteCheckoutSuccess] = useState(false);
  const router = useRouter();

  const CHECKOUT_ID = () => localStorage.getItem('CheckOutID');

  useEffect(() => {
    const fetchCheckoutTotal = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post(
          'https://saleor-kombee.onrender.com/graphql/',
          {
            query: `
              query GetCheckoutTotal($checkoutId: ID!) {
                checkout(id: $checkoutId) {
                  id
                  totalPrice {
                    gross {
                      amount
                      currency
                    }
                  }
                  subtotalPrice {
                    gross {
                      amount
                      currency
                    }
                  }
                  shippingPrice {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
            `,
            variables: { checkoutId: CHECKOUT_ID() },
          }
        );

        const { data } = response.data;
        if (data.checkout) {
          setCheckoutData(data.checkout);
        }
      } catch (err) {
        setError('Failed to fetch checkout data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutTotal();
  }, []);

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    setPaymentSuccess(false);

    const paymentMutation = `
      mutation AddPaymentMethod($checkoutId: ID!, $paymentMethod: PaymentInput!) {
        checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentMethod) {
          checkout {
            id
            totalPrice {
              gross {
                amount
                currency
              }
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const paymentVariables = {
      checkoutId: CHECKOUT_ID(),
      paymentMethod: {
        gateway: 'mirumee.payments.dummy',
        token: 'dummy-token',
        amount: checkoutData?.totalPrice.gross.amount || 0,
      },
    };

    try {
      const response = await axios.post(
        'https://saleor-kombee.onrender.com/graphql/',
        {
          query: paymentMutation,
          variables: paymentVariables,
        }
      );

      const { errors } = response.data.data.checkoutPaymentCreate;

      if (errors.length > 0) {
        setPaymentError(errors.map((e: any) => e.message).join(', '));
      } else {
        setPaymentSuccess(true);
        handleCompleteCheckout();
        router.push('/checkout/complete');
      }
    } catch (err) {
      setPaymentError('Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCompleteCheckout = async () => {
    setCompleteCheckoutLoading(true);
    setCompleteCheckoutError('');
    setCompleteCheckoutSuccess(false);

    const completeCheckoutMutation = `
      mutation CompleteCheckout($checkoutId: ID!) {
        checkoutComplete(checkoutId: $checkoutId) {
          order {
            id
            status
            number
            total {
              gross {
                amount
                currency
              }
            }
            lines {
              id
              quantity
              variant {
                id
                name
                product {
                  name
                }
              }
            }
          }
          confirmationNeeded
          confirmationData
          errors {
            field
            message
          }
        }
      }
    `;

    const completeCheckoutVariables = {
      checkoutId: CHECKOUT_ID(),
    };

    try {
      const response = await axios.post(
        'https://saleor-kombee.onrender.com/graphql/',
        {
          query: completeCheckoutMutation,
          variables: completeCheckoutVariables,
        }
      );

      const { errors } = response.data.data.checkoutComplete;

      if (errors.length > 0) {
        setCompleteCheckoutError(errors.map((e: any) => e.message).join(', '));
      } else {
        setCompleteCheckoutSuccess(true);
      }
    } catch (err) {
      setCompleteCheckoutError('Failed to complete checkout. Please try again.');
    } finally {
      setCompleteCheckoutLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading checkout info...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!checkoutData) return <div className="text-center py-10">No checkout data available.</div>;

  const { totalPrice, subtotalPrice, shippingPrice } = checkoutData;

  return (
    <>
      <StepProgressBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Review Your Order</h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {subtotalPrice.gross.amount} {subtotalPrice.gross.currency}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>
                {shippingPrice.gross.amount} {shippingPrice.gross.currency}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-semibold text-purple-800">
              <span>Total:</span>
              <span>
                {totalPrice.gross.amount} {totalPrice.gross.currency}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {paymentSuccess && (
              <div className="text-green-600 text-sm text-center">
                ✅ Payment successful! Completing checkout...
              </div>
            )}

            {paymentError && (
              <div className="text-red-500 text-sm text-center">{paymentError}</div>
            )}

            {completeCheckoutSuccess && (
              <div className="text-green-600 text-sm text-center">
                🎉 Checkout complete! Your order is being processed.
              </div>
            )}

            {completeCheckoutError && (
              <div className="text-red-500 text-sm text-center">{completeCheckoutError}</div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentLoading || completeCheckoutLoading}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition duration-300 ${
                paymentLoading || completeCheckoutLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {paymentLoading ? 'Processing Payment...' : completeCheckoutLoading ? 'Completing Checkout...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutTotal;
