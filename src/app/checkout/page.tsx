import React from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  quantity: number;
  discount: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "2 CTW Emerald Lab Grown Diamond Eternity Band",
    image: "/images/ring.png",
    price: 2099,
    originalPrice: 3499,
    rating: 4.96,
    reviews: 7274,
    quantity: 1,
    discount: 40,
  },
  {
    id: 2,
    name: "Abstract Crossover",
    image: "/images/ring.png",
    price: 2099,
    originalPrice: 3499,
    rating: 4.96,
    reviews: 7274,
    quantity: 1,
    discount: 40,
  },
];

const CheckoutPage: React.FC = () => {
  const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const totalDiscount = products.reduce(
    (acc, product) => acc + (product.originalPrice - product.price) * product.quantity,
    0
  );
  const total = subtotal;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Items */}
      <div className="bg-white shadow-md rounded-lg p-4 space-y-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">Pack of: {product.quantity}</p>
              <p className="text-sm text-yellow-600">
                {product.rating} ★ ({product.reviews} reviews)
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-pink-600">₹{product.price}</p>
              <p className="line-through text-sm text-gray-400">₹{product.originalPrice}</p>
              <p className="text-sm text-purple-500 font-semibold">
                {product.discount}% OFF
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount</span>
          <span className="text-green-600">− ₹{totalDiscount}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded"
          >
            Pay ₹{total}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
