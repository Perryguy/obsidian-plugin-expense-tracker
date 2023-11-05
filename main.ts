import { Plugin, Notice } from 'obsidian';
import FinanceTrackerModal from './src/FinanceTrackerModal';
import SampleSettingTab from './src/Setting';

interface MyPluginSettings {
  monthlyBudget: number;
  billDueDay: number;
  salaryDate: string;
  salary: number;
  // Add other settings fields here
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
  monthlyBudget: 1000,
  billDueDay: 1,
  salaryDate: '2023-01-01',
  salary: 0, // YYYY-MM-DD format
  // Set other default values here
};

export default class FinanceTrackerPlugin extends Plugin {
  settings: MyPluginSettings;
  financeFolderPath: string = '/Finances';
  DailyExpensesPath: string = `${this.financeFolderPath}/DailyExpenses`;
  MonthlyReportPath: string = `${this.financeFolderPath}/MonthlyReports`;

  async onload() {
    await this.ensureAllFinanceFoldersExist();
    await this.loadSettings();

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.addCommand({
      id: 'open-finance-tracker-modal',
      name: 'Open Finance Tracker',
      callback: () => {
        new FinanceTrackerModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: 'generate-monthly-report',
      name: 'Generate Monthly Finance Report',
      callback: () => {
        // Logic to show a date picker and then generate a report
        // For simplicity, we are assuming you have a way to capture the date here
        const selectedDate = new Date(); // Replace with user input
        this.createMonthlyFinanceFile(selectedDate);
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async ensureAllFinanceFoldersExist(): Promise<void> {
    // Ensure the main finance folder exists
    const financeFolderPath = "/Finances";
    let folderExists = await this.app.vault.adapter.exists(financeFolderPath);
    if (!folderExists) {
      await this.app.vault.createFolder(financeFolderPath);
      new Notice('Finance folder created successfully.', 3000);
    }

    // Ensure the monthly report folder exists
    const monthlyReportPath = `${financeFolderPath}/MonthlyReports`;
    folderExists = await this.app.vault.adapter.exists(monthlyReportPath);
    if (!folderExists) {
      await this.app.vault.createFolder(monthlyReportPath);
      new Notice('Monthly Reports folder created successfully.', 3000);
    }

    // Ensure the daily expenses folder exists
    const dailyExpensesPath = `${financeFolderPath}/DailyExpenses`;
    folderExists = await this.app.vault.adapter.exists(dailyExpensesPath);
    if (!folderExists) {
      await this.app.vault.createFolder(dailyExpensesPath);
      new Notice('Daily Expenses folder created successfully.', 3000);
    }
  }

  async createMonthlyFinanceFile(selectedDate: Date): Promise<void> {
    // Determine the file name based on the selected date
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    const fileName = `Monthly-Report-${year}-${month}.md`;
  
    // Path for the new monthly report file
    const monthlyReportFilePath = `${this.MonthlyReportPath}/${fileName}`;
  
    // Check if the file already exists
    const fileExists = await this.app.vault.adapter.exists(monthlyReportFilePath);
    if (fileExists) {
      new Notice('Monthly report already exists.', 3000);
      return;
    }
  
    // Gather data for the monthly report
    // const monthlyData = await this.getTransactionsForMonth(selectedDate);
    // const reportContent = this.generateReportContent(monthlyData);
  
    // Create the new monthly report file with the generated content
    try {
      // await this.app.vault.create(monthlyReportFilePath, reportContent);
      new Notice('Monthly finance report created successfully.', 3000);
    } catch (error) {
      console.error('Error creating monthly finance file:', error);
      new Notice('Failed to create monthly finance report.', 3000);
    }
  }

  async saveTransaction(transaction: { date: string; amount: number; type: string; category: string }) {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
  
    let filePath = '';
  
    // Check if we need to create a new file
    // Check the current date, if we've passed the billDueDay and are in a new month, we create a new file
    if (today.getDate() > this.settings.billDueDay && today.getMonth() > transactionDate.getMonth()) {
      // If it's December, we also need to check the year transition
      if (transactionDate.getMonth() === 11 && today.getMonth() === 0) {
        filePath = this.DailyExpensesPath + `-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}.md`;
      } else {
        filePath = `${this.DailyExpensesPath}/${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 2).padStart(2, '0')}.md`; // +2 because getMonth() is 0 indexed, and we're adding for the next month
      }
    } else {
      filePath = `${this.DailyExpensesPath}/${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}.md`;
    }
  
    try {
      const fileContents = await this.app.vault.adapter.read(filePath).catch(() => '');
      const updatedContents = `${fileContents}- ${transaction.date} | ${transaction.amount} | ${transaction.type} | ${transaction.category}\n`;
      await this.app.vault.adapter.write(filePath, updatedContents);
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  }
  // ... Possibly more methods or logic
}
