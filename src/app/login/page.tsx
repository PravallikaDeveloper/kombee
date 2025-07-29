'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const query = {
        query: `
          mutation {
            tokenCreate(email: "${email}", password: "${password}") {
              token
              errors {
                message
              }
            }
          }
        `,
        variables: ''
      };

      const response = await axios.post(
        'https://saleor-kombee.onrender.com/graphql/',
        query,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, errors } = response.data.data.tokenCreate;

      if (token) {
        localStorage.setItem('authToken', token);
        setTimeout(() => {
          setIsLoading(false);
          router.push('/home');
        }, 500);
      } else {
        setIsLoading(false);
        setError(errors?.[0]?.message || 'Login failed');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500">
          Forgot your password?{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
