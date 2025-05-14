
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  CircleDollarSign, 
  Users, 
  Percent, 
  Receipt, 
  Plus, 
  Minus, 
  Upload,
  X 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";

interface Person {
  id: number;
  name: string;
  amount: number;
}

interface BillItem {
  id: number;
  name: string;
  price: number;
  assignedTo: number[];
}

const SplitBill = () => {
  const { toast } = useToast();
  const [billTotal, setBillTotal] = useState<number | ''>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [taxPercentage, setTaxPercentage] = useState<number | ''>('');
  const [splitMethod, setSplitMethod] = useState<string>('equal');
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Person 1', amount: 0 },
    { id: 2, name: 'Person 2', amount: 0 }
  ]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<number | ''>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Calculate splits
  const calculateSplits = () => {
    if (!billTotal) {
      toast({
        title: "Missing information",
        description: "Please enter the bill total",
        variant: "destructive"
      });
      return;
    }

    const total = Number(billTotal);
    const tip = total * (tipPercentage / 100);
    const tax = taxPercentage ? total * (Number(taxPercentage) / 100) : 0;
    const grandTotal = total + tip + tax;

    const updatedPeople = [...people];

    if (splitMethod === 'equal') {
      // Equal split
      const perPersonAmount = grandTotal / people.length;
      updatedPeople.forEach(person => {
        person.amount = perPersonAmount;
      });
    } else if (splitMethod === 'items' && items.length > 0) {
      // Item-based split
      // Reset all amounts first
      updatedPeople.forEach(person => {
        person.amount = 0;
      });
      
      // Calculate based on items
      items.forEach(item => {
        const numAssigned = item.assignedTo.length;
        if (numAssigned > 0) {
          const amountPerPerson = item.price / numAssigned;
          item.assignedTo.forEach(personId => {
            const personIndex = updatedPeople.findIndex(p => p.id === personId);
            if (personIndex >= 0) {
              updatedPeople[personIndex].amount += amountPerPerson;
            }
          });
        }
      });
      
      // Add tip and tax proportionally
      const itemTotal = items.reduce((sum, item) => sum + item.price, 0);
      if (itemTotal > 0) {
        updatedPeople.forEach(person => {
          const proportion = person.amount / itemTotal;
          person.amount += (tip + tax) * proportion;
        });
      }
    } else if (splitMethod === 'custom') {
      // Custom amounts already set by user, no action needed
    }
    
    setPeople(updatedPeople);
    
    toast({
      title: "Bill Split Calculated!",
      description: "The bill has been split among all participants."
    });
  };

  const handleAddPerson = () => {
    const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;
    setPeople([...people, { id: newId, name: `Person ${newId}`, amount: 0 }]);
  };

  const handleRemovePerson = (id: number) => {
    if (people.length > 2) {
      setPeople(people.filter(person => person.id !== id));
      setItems(items.map(item => ({
        ...item,
        assignedTo: item.assignedTo.filter(personId => personId !== id)
      })));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least 2 people to split a bill",
        variant: "destructive"
      });
    }
  };

  const updatePersonName = (id: number, name: string) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, name } : person
    ));
  };

  const updatePersonAmount = (id: number, amount: number | '') => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, amount: amount === '' ? 0 : amount } : person
    ));
  };

  const handleAddItem = () => {
    if (newItemName && newItemPrice) {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      setItems([...items, { 
        id: newId, 
        name: newItemName, 
        price: Number(newItemPrice), 
        assignedTo: [] 
      }]);
      setNewItemName('');
      setNewItemPrice('');
    } else {
      toast({
        title: "Missing information",
        description: "Please enter both item name and price",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleAssignment = (itemId: number, personId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const isAssigned = item.assignedTo.includes(personId);
        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter(id => id !== personId)
            : [...item.assignedTo, personId]
        };
      }
      return item;
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReceiptFile(event.target.files[0]);
      toast({
        title: "Receipt Uploaded",
        description: "In a real app, this would trigger AI parsing of items"
      });
    }
  };

  const simulateReceiptScan = () => {
    if (receiptFile) {
      toast({
        title: "Processing Receipt",
        description: "AI is analyzing your receipt..."
      });
      
      // Simulate AI processing with sample items
      setTimeout(() => {
        const sampleItems: BillItem[] = [
          { id: 1, name: "Pasta Dish", price: 14.99, assignedTo: [] },
          { id: 2, name: "Burger Deluxe", price: 12.99, assignedTo: [] },
          { id: 3, name: "Garlic Bread", price: 5.99, assignedTo: [] },
          { id: 4, name: "Soft Drinks", price: 8.99, assignedTo: [] }
        ];
        
        setItems(sampleItems);
        setBillTotal(sampleItems.reduce((sum, item) => sum + item.price, 0));
        
        toast({
          title: "Receipt Processed!",
          description: "Items have been extracted from your receipt"
        });
      }, 2000);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Split Your Bill</h1>
        <p className="text-gray-600 mb-8">Enter bill details and choose how to split it among your group</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Split</TabsTrigger>
                <TabsTrigger value="items">Items Split</TabsTrigger>
                <TabsTrigger value="receipt">Upload Receipt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="bill-total" className="flex items-center gap-2 mb-2">
                        <CircleDollarSign className="h-4 w-4" /> Bill Total
                      </Label>
                      <Input
                        id="bill-total"
                        type="number"
                        placeholder="0.00"
                        className="text-lg"
                        value={billTotal}
                        onChange={(e) => setBillTotal(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tip-percentage" className="flex items-center gap-2 mb-2">
                        <Percent className="h-4 w-4" /> Tip Percentage
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="tip-percentage"
                          type="number"
                          placeholder="15"
                          className="text-lg"
                          value={tipPercentage}
                          onChange={(e) => setTipPercentage(Number(e.target.value))}
                        />
                        <span className="ml-2 text-lg">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tax-percentage" className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4" /> Tax Percentage (Optional)
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="tax-percentage"
                          type="number"
                          placeholder="0"
                          className="text-lg"
                          value={taxPercentage}
                          onChange={(e) => setTaxPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                        <span className="ml-2 text-lg">%</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="split-method" className="mb-2 block">Split Method</Label>
                      <Select 
                        value={splitMethod} 
                        onValueChange={(value) => setSplitMethod(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select split method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equal">Equal Split</SelectItem>
                          <SelectItem value="items">Split by Items</SelectItem>
                          <SelectItem value="custom">Custom Amounts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={calculateSplits} className="w-full btn-primary">
                      Calculate Split
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="items">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Add Items to Split</h3>
                  
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="col-span-2">
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input
                        id="item-name"
                        placeholder="e.g. Pizza"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="item-price">Price</Label>
                      <Input
                        id="item-price"
                        type="number"
                        placeholder="0.00"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddItem} className="w-full">
                        <Plus className="mr-1 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                    {items.length > 0 ? (
                      items.map(item => (
                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex gap-1">
                              {people.map(person => (
                                <Button
                                  key={person.id}
                                  variant={item.assignedTo.includes(person.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleAssignment(item.id, person.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  {person.id}
                                </Button>
                              ))}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No items added yet. Add items to split the bill.
                      </p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="tip-percentage-items" className="flex items-center gap-2 mb-2">
                        <Percent className="h-4 w-4" /> Tip Percentage
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="tip-percentage-items"
                          type="number"
                          placeholder="15"
                          className="text-lg"
                          value={tipPercentage}
                          onChange={(e) => setTipPercentage(Number(e.target.value))}
                        />
                        <span className="ml-2 text-lg">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tax-percentage-items" className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4" /> Tax Percentage (Optional)
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="tax-percentage-items"
                          type="number"
                          placeholder="0"
                          className="text-lg"
                          value={taxPercentage}
                          onChange={(e) => setTaxPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                        <span className="ml-2 text-lg">%</span>
                      </div>
                    </div>
                    
                    <Button onClick={calculateSplits} className="w-full btn-primary">
                      Calculate Item-Based Split
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="receipt">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium mb-2">Upload Receipt Image</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload a photo of your receipt and our AI will extract items and prices
                      </p>
                      <Input 
                        id="receipt-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <label htmlFor="receipt-upload">
                        <Button asChild>
                          <div>
                            <Upload className="mr-2 h-4 w-4" />
                            Select Image
                          </div>
                        </Button>
                      </label>
                      {receiptFile && (
                        <p className="mt-4 text-sm text-gray-600">
                          {receiptFile.name}
                        </p>
                      )}
                    </div>
                    
                    {receiptFile && (
                      <Button onClick={simulateReceiptScan} className="w-full">
                        Process Receipt
                      </Button>
                    )}
                    
                    {items.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Extracted Items</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {items.map(item => (
                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex gap-1">
                                  {people.map(person => (
                                    <Button
                                      key={person.id}
                                      variant={item.assignedTo.includes(person.id) ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => toggleAssignment(item.id, person.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      {person.id}
                                    </Button>
                                  ))}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="h-8 w-8 text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Button onClick={calculateSplits} className="w-full btn-primary mt-4">
                          Calculate Split from Receipt
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" /> People
                </h3>
                <Button onClick={handleAddPerson} size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" /> Add Person
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {people.map(person => (
                  <div key={person.id} className="flex items-center gap-2">
                    <Input 
                      value={person.name} 
                      onChange={(e) => updatePersonName(person.id, e.target.value)}
                      className="w-full"
                    />
                    {splitMethod === 'custom' && (
                      <Input 
                        type="number" 
                        value={person.amount || ''}
                        onChange={(e) => updatePersonAmount(person.id, e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-24" 
                        placeholder="0.00"
                      />
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemovePerson(person.id)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-semibold">Results</h3>
                <div className="space-y-2">
                  {people.map(person => (
                    <div key={person.id} className="flex justify-between items-center">
                      <span>{person.name}</span>
                      <span className="font-semibold">${person.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${billTotal ? Number(billTotal).toFixed(2) : '0.00'}</span>
                </div>
                
                {(tipPercentage > 0 || (taxPercentage && Number(taxPercentage) > 0)) && (
                  <>
                    {tipPercentage > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Tip ({tipPercentage}%)</span>
                        <span>${billTotal ? (Number(billTotal) * tipPercentage / 100).toFixed(2) : '0.00'}</span>
                      </div>
                    )}
                    
                    {taxPercentage && Number(taxPercentage) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Tax ({taxPercentage}%)</span>
                        <span>${billTotal ? (Number(billTotal) * Number(taxPercentage) / 100).toFixed(2) : '0.00'}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center font-bold pt-1">
                      <span>Grand Total</span>
                      <span>
                        ${billTotal ? (
                          Number(billTotal) * (1 + tipPercentage / 100 + (taxPercentage ? Number(taxPercentage) / 100 : 0))
                          ).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-8 space-y-4">
                <Button variant="outline" className="w-full">
                  Save Calculation
                </Button>
                <Button variant="outline" className="w-full">
                  Share With Group
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SplitBill;
