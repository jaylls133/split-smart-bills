
/**
 * Storage utility functions for persisting data with expiration time
 */

// Generic function to save data to localStorage with an expiration date
export const saveWithExpiry = <T>(key: string, value: T, expiryDays: number): void => {
  const now = new Date();
  const expiryTime = now.getTime() + expiryDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
  const item = {
    value,
    expiry: expiryTime,
  };
  
  localStorage.setItem(key, JSON.stringify(item));
};

// Generic function to get data from localStorage if not expired
export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  // Return null if item doesn't exist
  if (!itemStr) {
    return null;
  }
  
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  
  // Compare the expiry time of the item with the current time
  if (now > item.expiry) {
    // If the item is expired, delete it from storage and return null
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value;
};

// Function to clear all stored data
export const clearStorage = (key: string): void => {
  localStorage.removeItem(key);
};
