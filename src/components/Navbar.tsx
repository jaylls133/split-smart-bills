
import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDollarSign, History } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <CircleDollarSign className="h-6 w-6 text-bill-blue" />
          <span className="gradient-text">BillSplit</span>
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="font-medium text-gray-600 hover:text-bill-blue transition-colors">
            Home
          </Link>
          <Link to="/split" className="font-medium text-gray-600 hover:text-bill-blue transition-colors">
            Split Bill
          </Link>
          <Link to="/groups" className="font-medium text-gray-600 hover:text-bill-blue transition-colors">
            Groups
          </Link>
          <Link to="/scan" className="font-medium text-gray-600 hover:text-bill-blue transition-colors">
            Scan Receipt
          </Link>
          <Link to="/history" className="font-medium text-gray-600 hover:text-bill-blue transition-colors">
            <History className="h-4 w-4 inline mr-1" />
            History
          </Link>
          <Link to="/" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
