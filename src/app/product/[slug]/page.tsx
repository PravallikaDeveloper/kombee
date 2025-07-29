"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GraphQLClient, gql } from "graphql-request";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  media: { id: string; url: string; alt: string }[];
  defaultVariant: {
    pricing: {
      price: {
        gross: { amount: number; currency: string };
      };
      priceUndiscounted: {
        gross: { amount: number; currency: string };
      };
    };
  };
}

const endpoint = "https://saleor-kombee.onrender.com/graphql/";
const client = new GraphQLClient(endpoint);

const PRODUCT_QUERY = gql`
  query GetProduct($slug: String, $channel: String) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      media {
        id
        url
        alt
      }
      defaultVariant {
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
          priceUndiscounted {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
`;

const PDP: React.FC = () => {
  const params = useParams();
  const slugvalue = typeof params.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugvalue) return;

    const fetchProduct = async () => {
      try {
        const data: any = await client.request(PRODUCT_QUERY, {
          slug: decodeURIComponent(slugvalue),
          channel: "online-inr",
        });
        setProduct(data.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slugvalue]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const price = product.defaultVariant?.pricing?.price?.gross;
  const original = product.defaultVariant?.pricing?.priceUndiscounted?.gross;
  const hasDiscount = original?.amount && original.amount > price?.amount;
  const discountPercent = hasDiscount
    ? Math.round(((original.amount - price.amount) / original.amount) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <div>
          {product.media?.[0]?.url ? (
            <img
              src={product.media[0].url}
              alt={product.media[0].alt}
              className="w-full max-h-[500px] object-contain rounded"
            />
          ) : (
            <div className="bg-gray-100 h-96 flex items-center justify-center text-gray-400 rounded">
              No Image Available
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>

          <div className="flex items-center space-x-4 text-xl">
            <span className="text-green-700 font-bold">₹{price?.amount}</span>
            {hasDiscount && (
              <>
                <span className="line-through text-gray-400">₹{original?.amount}</span>
                <span className="text-pink-600 font-semibold text-sm">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded text-lg font-medium">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDP;
