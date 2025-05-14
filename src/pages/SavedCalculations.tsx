
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getWithExpiry } from '../utils/storage';
import { SavedCalculation } from '../types/splitBill';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Calendar, Users, Receipt, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const STORAGE_KEY = 'billsplit_calculations';

const SavedCalculations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [selectedCalculation, setSelectedCalculation] = useState<SavedCalculation | null>(null);

  useEffect(() => {
    // Load calculations from localStorage
    const storedCalculations = getWithExpiry<SavedCalculation[]>(STORAGE_KEY);
    
    if (storedCalculations && storedCalculations.length > 0) {
      setCalculations(storedCalculations);
    }
  }, []);

  const viewCalculationDetails = (calculation: SavedCalculation) => {
    setSelectedCalculation(calculation);
  };

  const closeDetails = () => {
    setSelectedCalculation(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'p');
    } catch (error) {
      return '';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Saved Calculations History</h1>
            <p className="text-gray-600">
              View your past bill splits and calculations
              {calculations.length > 0 && (
                <span className="text-sm text-gray-500 block mt-1">
                  Your calculations are stored locally for 30 days
                </span>
              )}
            </p>
          </div>
          
          <Button onClick={() => navigate('/split')} variant="outline">
            Create New Split
          </Button>
        </div>

        {calculations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calculation) => (
              <Card key={calculation.id} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-bill-blue" />
                    {calculation.groupName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(calculation.date)} at {formatTime(calculation.date)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Receipt className="h-4 w-4" /> Bill Total
                      </span>
                      <span className="font-semibold">${calculation.billTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4" /> Split Between
                      </span>
                      <span>{calculation.people.length} people</span>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>Method: {calculation.splitMethod === 'equal' ? 'Equal Split' : 
                             calculation.splitMethod === 'items' ? 'Item-based Split' : 
                             'Custom Split'}</p>
                      <p>Tip: {calculation.tipPercentage}%</p>
                      {calculation.taxPercentage > 0 && <p>Tax: {calculation.taxPercentage}%</p>}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={() => viewCalculationDetails(calculation)} 
                    variant="outline" 
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No saved calculations</h3>
            <p className="text-gray-500 mb-8">
              You haven't saved any bill split calculations yet.
            </p>
            <Button onClick={() => navigate('/split')}>
              Create Your First Split
            </Button>
          </div>
        )}
      </div>
      
      {selectedCalculation && (
        <Dialog open={!!selectedCalculation} onOpenChange={() => closeDetails()}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedCalculation.groupName}</DialogTitle>
              <DialogDescription>
                Created on {formatDate(selectedCalculation.date)} at {formatTime(selectedCalculation.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Bill Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bill Total</span>
                    <span className="font-semibold">${selectedCalculation.billTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tip ({selectedCalculation.tipPercentage}%)</span>
                    <span>
                      ${(selectedCalculation.billTotal * selectedCalculation.tipPercentage / 100).toFixed(2)}
                    </span>
                  </div>
                  
                  {selectedCalculation.taxPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({selectedCalculation.taxPercentage}%)</span>
                      <span>
                        ${(selectedCalculation.billTotal * selectedCalculation.taxPercentage / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Grand Total</span>
                    <span>
                      ${(selectedCalculation.billTotal * (
                        1 + 
                        selectedCalculation.tipPercentage / 100 + 
                        selectedCalculation.taxPercentage / 100
                      )).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {selectedCalculation.items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Items</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedCalculation.items.map(item => (
                        <div key={item.id} className="bg-gray-50 p-3 rounded flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Split Results</h3>
                
                <div className="space-y-3">
                  {selectedCalculation.people.map(person => (
                    <div key={person.id} className="bg-gray-50 p-3 rounded flex justify-between">
                      <span>{person.name}</span>
                      <span className="font-semibold">${person.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Split Method</h3>
                  <p className="text-gray-600">
                    {selectedCalculation.splitMethod === 'equal' && 'Equal split between all participants'}
                    {selectedCalculation.splitMethod === 'items' && 'Split based on specific items per person'}
                    {selectedCalculation.splitMethod === 'custom' && 'Custom amount per person'}
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <Button 
                    onClick={() => {
                      // Here we would implement duplicating functionality
                      toast({
                        title: "Duplicate Feature",
                        description: "This would duplicate the calculation for editing (not implemented yet)"
                      });
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Duplicate This Split
                  </Button>
                  
                  <Button onClick={closeDetails} className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default SavedCalculations;
