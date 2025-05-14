
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  CircleDollarSign,
  Calendar,
  Clock,
  UserPlus
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Group {
  id: number;
  name: string;
  description: string;
  members: string[];
  expenses: Expense[];
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  paidBy: string;
}

const Groups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: 'Roommates',
      description: 'Apartment expenses',
      members: ['You', 'Alex', 'Sam'],
      expenses: [
        { id: 1, title: 'Groceries', amount: 84.52, date: '2025-05-10', paidBy: 'You' },
        { id: 2, title: 'Utilities', amount: 120.00, date: '2025-05-01', paidBy: 'Alex' },
      ]
    },
    {
      id: 2,
      name: 'Trip to NYC',
      description: 'Weekend getaway',
      members: ['You', 'Taylor', 'Jordan', 'Riley'],
      expenses: [
        { id: 3, title: 'Hotel', amount: 350.00, date: '2025-04-25', paidBy: 'You' },
        { id: 4, title: 'Dinner', amount: 180.75, date: '2025-04-26', paidBy: 'Taylor' },
      ]
    }
  ]);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  });

  const [newExpense, setNewExpense] = useState({
    groupId: 0,
    title: '',
    amount: '',
    paidBy: 'You'
  });
  
  const [newMember, setNewMember] = useState({
    groupId: 0,
    name: ''
  });

  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  
  const handleCreateGroup = () => {
    if (newGroup.name) {
      const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
      const group: Group = {
        id: newId,
        name: newGroup.name,
        description: newGroup.description,
        members: ['You'],
        expenses: []
      };
      
      setGroups([...groups, group]);
      setNewGroup({ name: '', description: '' });
      
      toast({
        title: "Group Created",
        description: `${newGroup.name} has been created successfully.`
      });
    }
  };
  
  const handleAddExpense = () => {
    if (newExpense.groupId && newExpense.title && newExpense.amount) {
      const groupIndex = groups.findIndex(g => g.id === newExpense.groupId);
      if (groupIndex >= 0) {
        const groupCopy = [...groups];
        const newId = groupCopy[groupIndex].expenses.length > 0 
          ? Math.max(...groupCopy[groupIndex].expenses.map(e => e.id)) + 1 
          : 1;
          
        const expense: Expense = {
          id: newId,
          title: newExpense.title,
          amount: Number(newExpense.amount),
          date: new Date().toISOString().split('T')[0],
          paidBy: newExpense.paidBy
        };
        
        groupCopy[groupIndex] = {
          ...groupCopy[groupIndex],
          expenses: [...groupCopy[groupIndex].expenses, expense]
        };
        
        setGroups(groupCopy);
        setNewExpense({ groupId: 0, title: '', amount: '', paidBy: 'You' });
        
        toast({
          title: "Expense Added",
          description: `${expense.title} has been added to the group.`
        });
      }
    }
  };
  
  const handleAddMember = () => {
    if (newMember.groupId && newMember.name) {
      const groupIndex = groups.findIndex(g => g.id === newMember.groupId);
      if (groupIndex >= 0) {
        const groupCopy = [...groups];
        groupCopy[groupIndex] = {
          ...groupCopy[groupIndex],
          members: [...groupCopy[groupIndex].members, newMember.name]
        };
        
        setGroups(groupCopy);
        setNewMember({ groupId: 0, name: '' });
        
        toast({
          title: "Member Added",
          description: `${newMember.name} has been added to the group.`
        });
      }
    }
  };

  const viewGroup = (group: Group) => {
    setActiveGroup(group);
  };

  const getTotalExpenses = (group: Group) => {
    return group.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getBalances = (group: Group) => {
    const memberBalances: Record<string, number> = {};
    const totalExpenses = getTotalExpenses(group);
    const perPersonAmount = totalExpenses / group.members.length;
    
    // Initialize all members with 0 balance
    group.members.forEach(member => {
      memberBalances[member] = 0;
    });
    
    // Add amounts paid by each person
    group.expenses.forEach(expense => {
      memberBalances[expense.paidBy] += expense.amount;
    });
    
    // Calculate final balances (paid - owed)
    group.members.forEach(member => {
      memberBalances[member] = Number((memberBalances[member] - perPersonAmount).toFixed(2));
    });
    
    return memberBalances;
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Groups</h1>
            <p className="text-gray-600">Manage your expense groups and see who owes what</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Group</DialogTitle>
                <DialogDescription>
                  Create a group to track shared expenses with friends, roommates, or colleagues.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input 
                    id="group-name" 
                    placeholder="e.g. Roommates, Trip to Europe" 
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description (Optional)</Label>
                  <Input 
                    id="group-description" 
                    placeholder="What is this group for?" 
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleCreateGroup} type="submit">Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Card key={group.id} className="card-hover">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-bill-blue" /> 
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {group.members.map((member, i) => (
                        <div key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="font-semibold text-lg">
                      ${getTotalExpenses(group).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Recent Activity</p>
                    {group.expenses.length > 0 ? (
                      <div className="mt-1 space-y-1">
                        {group.expenses.slice(0, 2).map(expense => (
                          <div key={expense.id} className="flex justify-between text-sm">
                            <span>{expense.title}</span>
                            <span>${expense.amount.toFixed(2)}</span>
                          </div>
                        ))}
                        {group.expenses.length > 2 && (
                          <p className="text-xs text-gray-500 italic">
                            + {group.expenses.length - 2} more expenses
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-1">
                        No expenses yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => viewGroup(group)}
                >
                  View Details
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setNewExpense({...newExpense, groupId: group.id})}
                      variant="default" 
                      size="sm"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a New Expense</DialogTitle>
                      <DialogDescription>
                        Add an expense to {group.name}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-title">Expense Description</Label>
                        <Input 
                          id="expense-title" 
                          placeholder="e.g. Dinner, Groceries" 
                          value={newExpense.title}
                          onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount</Label>
                        <Input 
                          id="expense-amount" 
                          type="number"
                          placeholder="0.00" 
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expense-payer">Paid By</Label>
                        <select 
                          id="expense-payer"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          value={newExpense.paidBy}
                          onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                        >
                          {group.members.map((member, i) => (
                            <option key={i} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleAddExpense} type="submit">Add Expense</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {activeGroup && (
          <Dialog open={!!activeGroup} onOpenChange={open => !open && setActiveGroup(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{activeGroup.name}</DialogTitle>
                <DialogDescription>{activeGroup.description}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" /> Members
                  </h3>
                  
                  <div className="space-y-2">
                    {activeGroup.members.map((member, i) => (
                      <div key={i} className="bg-gray-100 px-3 py-2 rounded-md flex justify-between">
                        <span>{member}</span>
                        <span className={`font-medium ${getBalances(activeGroup)[member] > 0 ? 'text-green-600' : getBalances(activeGroup)[member] < 0 ? 'text-red-600' : ''}`}>
                          {getBalances(activeGroup)[member] > 0 ? '+' : ''}
                          ${getBalances(activeGroup)[member]}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setNewMember({...newMember, groupId: activeGroup.id})}
                          variant="outline" 
                          size="sm"
                          className="w-full"
                        >
                          <UserPlus className="mr-1 h-4 w-4" /> Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a New Member</DialogTitle>
                          <DialogDescription>
                            Add a person to {activeGroup.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="member-name">Name</Label>
                            <Input 
                              id="member-name" 
                              placeholder="e.g. John Smith" 
                              value={newMember.name}
                              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button onClick={handleAddMember} type="submit">Add Member</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4" /> Expenses
                    </h3>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setNewExpense({...newExpense, groupId: activeGroup.id})}
                          variant="default" 
                          size="sm"
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Expense
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a New Expense</DialogTitle>
                          <DialogDescription>
                            Add an expense to {activeGroup.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="expense-title-modal">Expense Description</Label>
                            <Input 
                              id="expense-title-modal" 
                              placeholder="e.g. Dinner, Groceries" 
                              value={newExpense.title}
                              onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="expense-amount-modal">Amount</Label>
                            <Input 
                              id="expense-amount-modal" 
                              type="number"
                              placeholder="0.00" 
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="expense-payer-modal">Paid By</Label>
                            <select 
                              id="expense-payer-modal"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              value={newExpense.paidBy}
                              onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                            >
                              {activeGroup.members.map((member, i) => (
                                <option key={i} value={member}>
                                  {member}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button onClick={handleAddExpense} type="submit">Add Expense</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto border rounded-md">
                    {activeGroup.expenses.length > 0 ? (
                      <div className="divide-y">
                        {activeGroup.expenses.map(expense => (
                          <div key={expense.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{expense.title}</p>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {expense.date}
                                <span className="mx-1">•</span>
                                <Users className="h-3 w-3" /> {expense.paidBy}
                              </div>
                            </div>
                            <div className="font-semibold text-right">
                              ${expense.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <p>No expenses added to this group yet.</p>
                        <p>Add your first expense to start tracking.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Total Expenses</span>
                      <span className="font-bold">${getTotalExpenses(activeGroup).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Per Person (Equal Split)</span>
                      <span>${(getTotalExpenses(activeGroup) / activeGroup.members.length).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex gap-2 justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveGroup(null)}
                    >
                      Close
                    </Button>
                    <Button>Settle Up</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default Groups;
