'use client';
import React, { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { FaStar } from "react-icons/fa";
import { getStorage, setStorage } from '../../services/storage';
import ShippingZones from "@/components/shippingzones/shippingzones";


type Product = {
  id: string;
  name: string;
  slug: string;
  media: { url: string; alt: string }[];
  variants: { id: string; name: string; sku: string }[];
};

const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  useEffect(() => {
    const fetchProducts = () => {
      const data = getStorage("products");
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 relative transition hover:shadow-md"
            >
              <div className="absolute top-2 right-2 bg-purple-400 text-xs font-bold px-2 py-1 rounded">
                40% OFF
              </div>

              <a href={`/product/${product.slug}`}>
                <img
                  src={product.media?.[0]?.url || "/placeholder.jpg"}
                  alt={product.media?.[0]?.alt || product.name}
                  className="w-full h-48 object-cover rounded"
                />
              </a>
              <div className="mt-4">
                <a
                  href={`/product/${product.slug}`}
                  className="block text-lg font-semibold truncate hover:text-purple-600"
                >
                  {product.name}
                </a>

                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>4.96 Star (7274 reviews)</span>
                </div>

                <div className="mt-2">
                  <span className="text-lg font-bold text-gray-900">₹2,099</span>
                  <span className="text-sm text-gray-500 line-through ml-2">₹3,499</span>
                </div>

                <p className="text-sm text-gray-600 mt-1">Pack of: 1</p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
                      }))
                    }
                    className="bg-gray-300 text-gray-700 px-2 rounded"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-12 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: (prev[product.id] || 1) + 1,
                      }))
                    }
                    className="bg-gray-300 text-gray-700 px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
