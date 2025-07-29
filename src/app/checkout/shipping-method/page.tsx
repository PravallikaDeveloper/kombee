"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import StepProgressBar from '@/components/stepprogessbar';
import { useRouter } from 'next/navigation';

interface Price {
  amount: number;
  currency: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: Price;
}

interface Checkout {
  availableShippingMethods: ShippingMethod[];
}

const ShippingMethod: React.FC = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const CHECKOUT_ID = () => localStorage.getItem('CheckOutID');

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.post(
          'https://saleor-kombee.onrender.com/graphql/',
          {
            query: `
                query GetShippingMethods($checkoutId: ID!) {
                  checkout(id: $checkoutId) {
                    id
                    availableShippingMethods {
                      id
                      name
                      price {
                        amount
                        currency
                      }
                      minimumOrderPrice {
                        amount
                        currency
                      }
                    }
                    __typename
                  }
                }
              `,
            variables: {
              checkoutId: CHECKOUT_ID(),
            },
          }
        );


        const methods: ShippingMethod[] = response.data.data.checkout.availableShippingMethods;
        setShippingMethods(methods);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setError('Failed to load shipping methods.');
        setLoading(false);
      }
    };

    if (CHECKOUT_ID()) {
      fetchShippingMethods();
    } else {
      setError('Checkout ID is missing.');
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedShippingMethod) {
      setMessage('Please select a shipping method.');
      return;
    }

    try {
      const response = await axios.post('https://saleor-kombee.onrender.com/graphql/', {
        query: `
          mutation SetShippingMethod($checkoutId: ID!, $shippingMethodId: ID!) {
            checkoutShippingMethodUpdate(checkoutId: $checkoutId, shippingMethodId: $shippingMethodId) {
              checkout {
                id
                shippingMethod {
                  id
                  name
                  price {
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
        `,
        variables: {
          checkoutId: CHECKOUT_ID(),
          shippingMethodId: selectedShippingMethod,
        },
      });

      const data = response.data.data.checkoutShippingMethodUpdate;

      if (data.errors && data.errors.length > 0) {
        setMessage('Failed to update shipping method. Please try again.');
      } else {
        router.push('/checkout/total')
      }
    } catch (err) {
      console.error('Error updating shipping method:', err);
      setMessage('Failed to update shipping method. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <StepProgressBar />
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Select a Shipping Method</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-700">
              Shipping Method:
            </label>
            <select
              id="shippingMethod"
              value={selectedShippingMethod}
              onChange={(e) => setSelectedShippingMethod(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select a shipping method</option>
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {`${method.name} - ₹${method.price.amount}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Submit
          </button>

          {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default ShippingMethod;
