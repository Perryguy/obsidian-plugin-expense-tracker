// src/FinanceTracker.tsx
import React, { useState } from 'react';
import Plugin  from '../main';

interface FinanceTrackerProps {
  plugin : Plugin; 
}

const FinanceTracker: React.FC<FinanceTrackerProps> = ({ plugin }) => {
  const [transaction, setTransaction] = useState({
    date: '',
    amount: 0,
    type: '',
    category: ''
  });
  

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await plugin.saveTransaction(transaction);
    setTransaction({ date: '', amount: 0, type: '', category: '' }); // Reset form
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
        <input
          type="text"
          value={transaction.type}
          onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
          placeholder="Type (e.g., Expense, Income)"
          required
        />
        <input
          type="text"
          value={transaction.category}
          onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
          placeholder="Category (e.g., Groceries, Salary)"
          required
        />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default FinanceTracker;
