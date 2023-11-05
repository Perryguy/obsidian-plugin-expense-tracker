import React, { useState, useEffect } from 'react';
import useObsidianFinanceAPI  from './hooks/useObsidianFinanceAPI'
import Plugin from '../main';

interface iProps{
  plugin: Plugin
  dataFilePath: string
}

const FinanceTracker = (props: iProps) => {
  const [transaction, setTransaction] = useState({
    date: '',
    amount: 0,
    type: '',
    category: ''
  });
  const [types, setTypes] = useState(['Expense', 'Income']); // Initial types
  const [categories, setCategories] = useState(['Groceries', 'Salary', 'Utilities']); // Initial categories
  const [showAddType, setShowAddType] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newType, setNewType] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const { data, loadTransactions, saveTypesAndCategories, loadTypesAndCategories, saveTransactions, } = useObsidianFinanceAPI(props.plugin.app.vault);

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    // Load data when component mounts
    loadTransactions(currentYear);
    loadTypesAndCategories();
  }, [loadTransactions, loadTypesAndCategories]);

  
  useEffect(() => {
    // Check if data is loaded (not empty)
    if (data.types.length > 0 && data.categories.length > 0) {
      setTypes(data.types);
      setCategories(data.categories);
      // ... set other parts of state based on loaded data
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("hello");

    e.preventDefault();
    // Add the current transaction to the existing list
console.log([transaction]);
    await saveTransactions([transaction]);  
  
    // Clear the form after saving
    setTransaction({
      date: '',
      amount: 0,
      type: '',
      category: ''
    });
    
    const currentYear = new Date().getFullYear().toString();
    // Load the updated transactions after saving
    await loadTransactions(currentYear);
    
    alert('Transaction saved successfully!');
  };

  // Handlers for selecting or adding a new type/category
  const handleTypeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowAddType(true);
    } else {
      setTransaction({ ...transaction, type: value });
      setShowAddType(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowAddCategory(true);
    } else {
      setTransaction({ ...transaction, category: value });
      setShowAddCategory(false);
    }
  };

  const handleAddType = async () => {
    if (newType && !types.includes(newType)) {
      const updatedTypes = [...types, newType];
      
      setTypes(updatedTypes);  // Optimistically update the UI
      
      try {
        // Then attempt to save to the file system with the updated list
        await saveTypesAndCategories(updatedTypes, categories);
        // If the above save is successful, the UI is already up to date.
      } catch (error) {
        // If saving fails, rollback the UI update or show an error
        console.error('Failed to save new type:', error);
        setTypes(types);  // Rollback the UI update if save fails
      }
  
      setShowAddType(true);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !types.includes(newCategory)) {
      const updatedCategory = [...categories, newCategory];
      
      setCategories(updatedCategory);  // Optimistically update the UI
      
      try {
        // Then attempt to save to the file system with the updated list
        // await saveTypesAndCategories(types, updatedCategory);
        // If the above save is successful, the UI is already up to date.
      } catch (error) {
        // If saving fails, rollback the UI update or show an error
        console.error('Failed to save new Category:', error);
        setCategories(categories);  // Rollback the UI update if save fails
      }
  
      setShowAddType(true);
    }
  };

  return (
    <div>
      <h2>Finance Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={transaction.date}
          onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
          required
        />
        <input
          type="number"
          value={transaction.amount}
          onChange={(e) => setTransaction({ ...transaction, amount: e.target.valueAsNumber })}
          required
        />

        {/* Dropdown for Type with Add New option */}
        <select value={transaction.type} onChange={handleTypeChange} required>
          <option value="">Select Type</option>
          {types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
          <option value="add_new">Add new type...</option>
        </select>

        {showAddType && (
          <div>
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="New type"
            />
            <button type="button" onClick={handleAddType}>Add</button>
          </div>
        )}

        {/* Dropdown for Category with Add New option */}
        <select value={transaction.category} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
          <option value="add_new">Add new category...</option>
        </select>

        {showAddCategory && (
          <div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
            />
            <button type="button" onClick={handleAddCategory}>Add</button>
          </div>
        )}

        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default FinanceTracker;
