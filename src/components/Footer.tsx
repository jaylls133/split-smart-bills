
import React from 'react';
import { CircleDollarSign } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 px-6 sm:px-10 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <CircleDollarSign className="h-6 w-6 text-bill-blue" />
              <span className="gradient-text">BillSplit</span>
            </div>
            <p className="text-gray-600 mb-4">
              Split bills fairly and easily with friends, roommates, or groups.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-bill-blue transition-colors">Home</a></li>
              <li><a href="/split" className="text-gray-600 hover:text-bill-blue transition-colors">Split Bill</a></li>
              <li><a href="/groups" className="text-gray-600 hover:text-bill-blue transition-colors">Groups</a></li>
              <li><a href="/scan" className="text-gray-600 hover:text-bill-blue transition-colors">Scan Receipt</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-600">
              Have questions or feedback? <br />
              Reach out to us at <a href="mailto:support@billsplit.app" className="text-bill-blue hover:underline">support@billsplit.app</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} BillSplit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
