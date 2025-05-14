
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Camera, 
  ArrowRight, 
  Edit, 
  Check, 
  X, 
  Users, 
  CircleDollarSign
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface ReceiptItem {
  id: number;
  name: string;
  price: number;
  editing: boolean;
}

const ScanReceipt = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset scan state
      setScanned(false);
      setItems([]);
    }
  };
  
  const simulateScan = () => {
    setScanning(true);
    setScanProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate scan completion
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      
      // Mock receipt items
      const mockItems: ReceiptItem[] = [
        { id: 1, name: 'Chicken Sandwich', price: 12.99, editing: false },
        { id: 2, name: 'French Fries', price: 4.50, editing: false },
        { id: 3, name: 'Iced Tea', price: 3.25, editing: false },
        { id: 4, name: 'Caesar Salad', price: 9.99, editing: false },
        { id: 5, name: 'Cheesecake Slice', price: 6.75, editing: false },
      ];
      
      const subTotalValue = mockItems.reduce((total, item) => total + item.price, 0);
      const taxValue = subTotalValue * 0.08; // 8% tax
      const tipValue = subTotalValue * 0.15; // 15% tip
      
      setItems(mockItems);
      setSubTotal(subTotalValue);
      setTax(taxValue);
      setTip(tipValue);
      
      toast({
        title: "Receipt Scanned Successfully",
        description: "We've detected 5 items from your receipt."
      });
    }, 3000);
  };
  
  const startEditing = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, editing: true } : item
    ));
  };
  
  const saveEdit = (id: number, name: string, price: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, name, price, editing: false } : item
    ));
    
    // Recalculate totals
    const newSubTotal = items.reduce((total, item) => {
      if (item.id === id) {
        return total + price;
      }
      return total + item.price;
    }, 0);
    
    setSubTotal(newSubTotal);
    setTax(newSubTotal * 0.08);
    setTip(newSubTotal * 0.15);
  };
  
  const cancelEdit = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, editing: false } : item
    ));
  };
  
  const deleteItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    
    // Recalculate totals
    const newSubTotal = updatedItems.reduce((total, item) => total + item.price, 0);
    setSubTotal(newSubTotal);
    setTax(newSubTotal * 0.08);
    setTip(newSubTotal * 0.15);
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from the receipt."
    });
  };
  
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const newItem: ReceiptItem = {
      id: newId,
      name: 'New Item',
      price: 0,
      editing: true
    };
    
    setItems([...items, newItem]);
  };
  
  const proceedToSplit = () => {
    // In a real app, you would pass this data to the split page
    toast({
      title: "Proceeding to Split",
      description: "Your receipt items are ready to be split."
    });
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Scan Receipt</h1>
        <p className="text-gray-600 mb-8">
          Upload a photo of your receipt and our AI will extract the items for splitting
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Upload Receipt Image</h2>
              
              {!filePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your receipt image here or click to browse
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Input 
                      id="receipt-upload" 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <Label htmlFor="receipt-upload">
                      <Button asChild variant="outline">
                        <div>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </div>
                      </Button>
                    </Label>
                    <Button variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={filePreview} 
                      alt="Receipt preview" 
                      className="w-full max-h-80 object-contain border rounded-lg mx-auto"
                    />
                    <Button 
                      variant="outline" 
                      className="absolute top-2 right-2 bg-white"
                      onClick={() => {
                        setFilePreview(null);
                        setFile(null);
                        setScanned(false);
                        setItems([]);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      {file?.name}
                    </p>
                    {!scanning && !scanned && (
                      <Button onClick={simulateScan} className="btn-primary">
                        Scan Receipt
                      </Button>
                    )}
                    
                    {scanning && (
                      <div className="space-y-2">
                        <Progress value={scanProgress} className="h-2" />
                        <p className="text-sm text-gray-600">
                          Scanning and processing your receipt...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {scanned && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Detected Items</h3>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="border rounded-md p-3 bg-white"
                    >
                      {item.editing ? (
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1">
                            <Input 
                              defaultValue={item.name}
                              id={`item-name-${item.id}`}
                              placeholder="Item name"
                            />
                          </div>
                          <div className="w-24">
                            <Input 
                              type="number" 
                              defaultValue={item.price}
                              id={`item-price-${item.id}`}
                              placeholder="Price"
                              step="0.01"
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 text-green-600"
                              onClick={() => {
                                const nameInput = document.getElementById(`item-name-${item.id}`) as HTMLInputElement;
                                const priceInput = document.getElementById(`item-price-${item.id}`) as HTMLInputElement;
                                saveEdit(
                                  item.id, 
                                  nameInput.value, 
                                  Number(priceInput.value)
                                );
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 text-red-600"
                              onClick={() => cancelEdit(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                            <Button 
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => startEditing(item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500"
                              onClick={() => deleteItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          <div className="space-y-6">
            {scanned && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Receipt Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tax" className="mb-2 block">Tax</Label>
                      <div className="flex">
                        <Input 
                          id="tax"
                          type="number"
                          value={tax}
                          onChange={(e) => setTax(Number(e.target.value))}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 flex items-center text-gray-600">
                          8%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tip" className="mb-2 block">Tip</Label>
                      <div className="flex">
                        <Input 
                          id="tip"
                          type="number"
                          value={tip}
                          onChange={(e) => setTip(Number(e.target.value))}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 flex items-center text-gray-600">
                          15%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      ${(subTotal + tax + tip).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/split">
                    <Button className="w-full btn-primary">
                      Proceed to Split <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full">
                    Save Receipt for Later
                  </Button>
                </div>
              </Card>
            )}
            
            <Card className="p-6 bg-gray-50 border-dashed">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CircleDollarSign className="h-6 w-6 text-bill-blue" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">About Receipt Scanning</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Our AI-powered receipt scanner extracts item names and prices automatically. 
                    You can edit any mistakes before splitting the bill.
                  </p>
                  <p className="text-gray-600 text-sm">
                    For best results:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1 mt-1">
                    <li>Make sure the receipt is well-lit and not wrinkled</li>
                    <li>Capture the entire receipt in the photo</li>
                    <li>Review the extracted items and edit if necessary</li>
                  </ul>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-50 border-dashed">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-bill-blue" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Next Step: Split Items</h3>
                  <p className="text-gray-600 text-sm">
                    After scanning your receipt, you'll be able to assign items to specific people 
                    in your group. You can split items equally or assign them to individuals.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanReceipt;
