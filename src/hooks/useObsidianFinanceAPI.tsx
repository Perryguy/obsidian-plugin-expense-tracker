import { Vault } from 'obsidian';
import { useState } from 'react';

interface FinanceData {
    types: string[];
    categories: string[];
    transactions: { date: string; amount: number; type: string; category: string; }[];
  }
const useObsidianFinanceAPI = (vault: Vault) => {
  const [data, setData] = useState<FinanceData>({ types: [], categories: [], transactions: []});
  const typesAndCategoriesFilePath = '.obsidian/plugins/obsidian-plugin-expense-tracker/typesAndCategories.json';
  const financeFolderPath = '/Finances';
  const transactionsFilePath = `${financeFolderPath}/DailyExpenses`;


  // Function to load data from the vault
  const loadTypesAndCategories = async () => {
    let fileContent;
    try {
      fileContent = await vault.adapter.read(typesAndCategoriesFilePath);
      const jsonData = JSON.parse(fileContent);
      setData(prevData => ({ ...prevData, types: jsonData.types, categories: jsonData.categories }));
    } catch (writeError) {
        if (writeError.code === 'ENOENT') {
            // File path does not exist, you might want to ensure directory structure first
            fileContent = JSON.stringify(fileContent, null, 2);
            await vault.adapter.write(typesAndCategoriesFilePath, fileContent);
          } else {

            throw writeError;
          }
    }
  };

  // Function to load transactions
  const loadTransactions = async (year: string) => {
    const filePath = `${financeFolderPath}/${year}_DailyExpenses.json`;
    try {
      let fileContent;
      try {
        fileContent = await vault.adapter.read(filePath);
      } catch (readError) {
        if (readError.code === 'ENOENT') {
          // File does not exist, so create it with default content
          fileContent = JSON.stringify({ transactions: [] }, null, 2);
          await vault.adapter.write(filePath, fileContent);
        } else {
          throw readError; // Re-throw the error if it's not a 'file not found' error
        }
      }
      const jsonData = JSON.parse(fileContent);
      setData(prevData => ({ ...prevData, transactions: jsonData.transactions }));
    } catch (error) {
      console.error(`Failed to load or create transactions for year ${year}:`, error);
    }
  };

  // Function to save types and categories
  const saveTypesAndCategories = async (types: string[], categories: string[]) => {
    try {
      const fileContent = JSON.stringify({ types, categories}, null, 2);
      await vault.adapter.write(typesAndCategoriesFilePath, fileContent);
    } catch (error) {
      console.error('Failed to save types and categories:', error);
    }
  };

  // Function to save transactions
  const saveTransactions = async (newTransactions: FinanceData['transactions']) => {
    try {
      // Add logic to determine the correct file based on the transaction's date
      const transactionYear = newTransactions.length > 0 
                              ? newTransactions[0].date.split('-')[0] 
                              : new Date().getFullYear().toString(); // default to current year
      console.log(transactionYear);
      const filePath = `${transactionsFilePath}/${transactionYear}_DailyExpenses.json`;
  
      // Read the existing file or start with an empty array if the file doesn't exist
      let existingTransactions = [];
      try {
        const fileContent = await vault.adapter.read(filePath);
        existingTransactions = JSON.parse(fileContent).transactions;
      } catch (error) {
        // If the file doesn't exist, we start with an empty array
      }
  
      // Combine existing transactions with the new ones
      const combinedTransactions = [...existingTransactions, ...newTransactions];
      
      // Save the updated JSON data
      const fileContent = JSON.stringify({ transactions: combinedTransactions }, null, 2);
      await vault.adapter.write(filePath, fileContent);
    } catch (error) {
      console.error("Failed to save transactions:", error);
    }
  };

  return {
    data,
    loadTransactions,
    saveTypesAndCategories,
    loadTypesAndCategories,
    saveTransactions,
  };
};

export default useObsidianFinanceAPI;
