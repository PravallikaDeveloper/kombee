'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import StepProgressBar from '@/components/stepprogessbar';

interface Price {
  amount: number;
  currency: string;
}

interface CheckoutData {
  id: string;
  totalPrice: {
    gross: Price;
  };
  subtotalPrice: {
    gross: Price;
  };
  shippingPrice: {
    gross: Price;
  };
}

interface CheckoutResponse {
  data: {
    checkout: CheckoutData | null;
  };
}

const GRAPHQL_ENDPOINT = 'https://saleor-kombee.onrender.com/graphql/';

const PaymentSummary: React.FC = () => {
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const checkoutId = () => localStorage.getItem('CheckOutID');
  const router = useRouter()
  useEffect(() => {
    const fetchCheckoutTotal = async () => {
      setLoading(true);
      setError(null);

      const query = `
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
      `;

      try {
        const response = await axios.post<CheckoutResponse>(
          GRAPHQL_ENDPOINT,
          {
            query,
            variables: { checkoutId: checkoutId() },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.data.checkout) {
          setCheckout(response.data.data.checkout);
        } else {
          setError('No checkout data found.');
        }
      } catch (err) {
        setError('Failed to fetch checkout total.');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutTotal();
  }, []);

  return (
    <>
      <StepProgressBar></StepProgressBar>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
            Payment Details
          </h2>

          {loading && <p className="text-center text-gray-500">Loading checkout totals...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && checkout && (
            <>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>
                    {checkout.subtotalPrice.gross.amount} {checkout.subtotalPrice.gross.currency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Shipping:</span>
                  <span>
                    {checkout.shippingPrice.gross.amount} {checkout.shippingPrice.gross.currency}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 mt-3 font-semibold text-purple-800">
                  <span>Total:</span>
                  <span>
                    {checkout.totalPrice.gross.amount} {checkout.totalPrice.gross.currency}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-8 w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                onClick={() => {
                  router.push('/checkout/shipping-method')
                  console.log('Next clicked');
                }}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSummary;
