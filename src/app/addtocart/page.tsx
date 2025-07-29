"use client";

import React, { useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://saleor-kombee.onrender.com/graphql/";
const client = new GraphQLClient(endpoint);

const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              id
              name
              slug
              thumbnail {
                url
              }
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
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

interface AddToCartProps {
  variantId: string;
}

const AddToCart: React.FC<any> = ({ variantId }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddToCart = async () => {
    if (!email) {
      setErrorMsg("Please enter your email.");
      setSuccessMsg("");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const variables = {
        input: {
          channel: "online-inr",
          email,
          lines: [
            {
              quantity: 1,
              variantId,
            },
          ],
        },
      };

      const response: any = await client.request(ADD_TO_CART_MUTATION, variables);

      if (response.checkoutCreate.errors.length > 0) {
        setErrorMsg(response.checkoutCreate.errors[0].message);
      } else {
        setSuccessMsg("Added to cart successfully!");
      }
    } catch (error) {
      setErrorMsg("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 rounded w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-orange-500 text-white py-2 px-4 rounded disabled:opacity-50 w-full"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
    </div>
  );
};

export default AddToCart;
