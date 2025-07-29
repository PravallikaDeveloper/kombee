// components/Header.js
import React from 'react';
import { FaShoppingCart, FaHeart, FaUserCircle } from 'react-icons/fa';
import MyImage from '../assets/images/logo.webp';
const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center">
        </div>

        <div className="flex flex-1 justify-center mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb01fa]"
          />
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative cursor-pointer">
            <a href="/cart">
              <FaShoppingCart className="text-gray-800 text-2xl" />
              <span className="absolute top-0 right-0 text-xs text-white bg-[#cb01fa] rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </a>
          </div>

          <div className="relative cursor-pointer">
            <FaHeart className="text-gray-800 text-2xl" />
            <span className="absolute top-0 right-0 text-xs text-white bg-[#cb01fa] rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </div>

          {/* Profile Icon */}
          <div className="cursor-pointer">
            <a href='/login'>
             <FaUserCircle className="text-gray-800 text-2xl" />
            </a>
           
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
