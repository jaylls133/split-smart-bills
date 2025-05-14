
export interface Person {
  id: number;
  name: string;
  amount: number;
}

export interface BillItem {
  id: number;
  name: string;
  price: number;
  assignedTo: number[];
}

export interface SavedCalculation {
  id: string;
  date: string;
  billTotal: number;
  tipPercentage: number;
  taxPercentage: number;
  splitMethod: string;
  people: Person[];
  items: BillItem[];
  groupName?: string;
}
