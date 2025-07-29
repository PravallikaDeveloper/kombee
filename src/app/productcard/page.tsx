'use client';
import React, { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { FaStar } from "react-icons/fa";
import { setStorage } from '../../services/storage';
import { useRouter } from "next/navigation";
import Header from "../header/page";


const endpoint = "https://saleor-kombee.onrender.com/graphql/";

const PRODUCTS_QUERY = gql`
  {
    products(first: 100, channel: "online-inr") {
      edges {
        node {
          id
          name
          slug
          media {
            url
            alt
          }
          variants {
            id
            name
            sku
          }
        }
      }
    }
  }
`;


type Product = {
  id: string;
  name: string;
  slug: string;
  media: { url: string; alt: string }[];
  variants: { id: string; name: string; sku: string }[];
};

const PLP: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const client = new GraphQLClient(endpoint);
      const data: any = await client.request(PRODUCTS_QUERY);
      const items = data.products.edges.map((edge: any) => edge.node);
      setProducts(items);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const addToCart = async (variantId: string, quantity: number, product: any) => {
    setStorage("products", product);
    const client = new GraphQLClient(endpoint);

    const ADDTOCART_MUTATION = gql`
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

    try {
      const variables = {
        input: {
          channel: "online-inr",
          email: "user@example.com",
          lines: [
            {
              variantId,
              quantity,
            },
          ],
        },
      };

      const data: any = await client.request(ADDTOCART_MUTATION, variables);

      if (data.checkoutCreate.errors.length) {
        alert("Failed to add to cart: " + data.checkoutCreate.errors[0].message);
      } else {
        alert(`Added ${quantity} item(s) to cart!`);
        localStorage.setItem("CheckOutID", data.checkoutCreate.checkout.id);
        router.push('/checkout/address');
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding to cart.");
    }
  };

  return (
    <>
    <Header></Header>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Product List

          <div style={{ 'float': 'right' }}>
            {/* <a href="/cart">Go to Cart</a> */}
          </div>
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 relative transition hover:shadow-md"
              >
                {/* Discount badge */}
                <div className="absolute top-2 right-2 bg-purple-400 text-xs font-bold px-2 py-1 rounded">
                  40% OFF
                </div>

                {/* Product image */}
                <a href={`/product/${product.slug}`}>
                  {product.media?.[0]?.url ? (
                    <img
                      src={product.media[0].url}
                      alt={product.media[0].alt || product.name}
                      onError={(e) => {
                        e.currentTarget.style.background = "black";
                        e.currentTarget.src = ""; 
                        e.currentTarget.alt = "Image not available";
                      }}
                      className="w-full h-48 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-48 bg-black rounded" />
                  )}

                </a>

                {/* Product info */}
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

                  {/* Quantity Selector */}
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

                  {/* Add to cart */}
                  <button
                    className="mt-3 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded"
                    onClick={() => {
                      const variantId = product.variants?.[0]?.id;
                      const quantity = quantities[product.id] || 1;
                      if (variantId) {
                        addToCart(variantId, quantity, product);
                      } else {
                        alert("No variant available for this product.");
                      }
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>

  );
};

export default PLP;
