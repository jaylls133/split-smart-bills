
import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <CircleDollarSign className="h-16 w-16 text-bill-blue mx-auto" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <div className="space-y-4">
          <Link to="/">
            <Button className="btn-primary w-full">
              Go to Homepage
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact us at <a href="mailto:support@billsplit.app" className="text-bill-blue hover:underline">support@billsplit.app</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
