'use client';

import React from 'react';

const SuccessMessage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Thank you for your message!</h3>
        <p className="mt-2 text-sm text-gray-500">
          We have received your request and will contact you soon.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          You will be redirected to the homepage in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage; 