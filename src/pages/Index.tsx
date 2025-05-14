
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CircleDollarSign, Users, ReceiptText, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Feature cards data
  const features = [
    {
      icon: <CircleDollarSign className="h-10 w-10 text-bill-blue mb-4" />,
      title: 'Easy Bill Splitting',
      description: 'Split bills equally, by percentage, or with custom amounts for each person.'
    },
    {
      icon: <ReceiptText className="h-10 w-10 text-bill-blue mb-4" />,
      title: 'AI Receipt Scanning',
      description: 'Upload a photo of your receipt and our AI will parse items automatically.'
    },
    {
      icon: <Users className="h-10 w-10 text-bill-blue mb-4" />,
      title: 'Group Management',
      description: 'Create groups for roommates, trips, or regular outings to track expenses easily.'
    },
    {
      icon: <LineChart className="h-10 w-10 text-bill-blue mb-4" />,
      title: 'Expense Analytics',
      description: 'Get insights into your spending patterns and track payments over time.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Split Bills <span className="gradient-text">Fairly</span> and <span className="gradient-text">Easily</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                The simplest way to split expenses with friends, roommates, or groups. 
                No more awkward money conversations or complicated calculations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/split">
                  <Button className="btn-primary w-full sm:w-auto">Start Splitting</Button>
                </Link>
                <Link to="/groups">
                  <Button className="btn-secondary w-full sm:w-auto">Manage Groups</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&h=500" 
                alt="Friends splitting a bill" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold mb-4">All the Features You Need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              BillSplit combines powerful expense tracking with an intuitive interface 
              to make splitting bills simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 sm:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Splitting expenses has never been easier. Follow these simple steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-bill-blue text-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Bill Details</h3>
              <p className="text-gray-600">
                Input the total amount, number of people, or scan your receipt with our AI.
              </p>
            </div>

            <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 rounded-full bg-bill-blue text-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize the Split</h3>
              <p className="text-gray-600">
                Choose to split equally or assign specific amounts to each person.
              </p>
            </div>

            <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-full bg-bill-blue text-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Settle</h3>
              <p className="text-gray-600">
                Share the split with your group and track who has paid.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link to="/split">
              <Button className="btn-primary animate-fade-in">Try It Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-bill-blue to-bill-teal rounded-2xl shadow-xl p-10 text-white">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Ready to Split Your First Bill?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have made expense sharing simple and stress-free.
            </p>
            <Link to="/split">
              <Button className="bg-white text-bill-blue hover:bg-gray-100 px-8 py-3 rounded-lg font-medium">
                Get Started — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
