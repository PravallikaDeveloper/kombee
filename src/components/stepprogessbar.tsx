'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const steps = [
  { label: 'Address', path: '/checkout/address' },
  { label: 'Payment Details', path: '/checkout/payment-details' },
  { label: 'Shipping Method', path: '/checkout/shipping-method' },
  { label: 'Payment method', path: '/checkout/payment' },
  { label: 'Complete', path: '/checkout/complete' },
];

export default function StepProgressBar() {
  const pathname = usePathname();

  const currentStepIndex = steps.findIndex((step) => pathname === step.path);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between max-w-5xl mx-auto px-4 py-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <React.Fragment key={index}>
              <Link href={step.path} className="flex flex-col items-center group cursor-pointer">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'border-green-500 bg-green-100' : isActive ? 'border-purple-500 bg-purple-100' : 'border-gray-300'}
                    group-hover:scale-105`}
                >
                  {isCompleted ? (
                    <FaCheckCircle className="text-green-600 text-lg" />
                  ) : (
                    <FaRegCircle className={isActive ? 'text-purple-600 text-base' : 'text-gray-500 text-base'} />
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                  {step.label}
                </span>
              </Link>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-300 mx-2 rounded-full" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
