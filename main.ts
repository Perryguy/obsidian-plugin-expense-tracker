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
  salary: 0, 
};

export default class FinanceTrackerPlugin extends Plugin {
  settings: MyPluginSettings;
  financeFolderPath = '/Finances';
  DailyExpensesPath = `${this.financeFolderPath}/DailyExpenses`;
  MonthlyReportPath = `${this.financeFolderPath}/MonthlyReports`;
  dataFilePath = '.obsidian/plugins/obsidian-plugin-expense-tracker/data.json';
  data = { transactions: [] };

  async onload() {
    await this.ensureAllFinanceFoldersExist();
    await this.loadSettings();

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.addCommand({
      id: 'open-finance-tracker-modal',
      name: 'Open Finance Tracker',
      callback: () => {
        new FinanceTrackerModal(this.app, this, this.dataFilePath).open();
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
    let folderExists = await this.app.vault.adapter.exists(this.financeFolderPath);
    if (!folderExists) {
      await this.app.vault.createFolder(this.financeFolderPath);
      new Notice('Finance folder created successfully.', 3000);
    }

    // Ensure the monthly report folder exists
    folderExists = await this.app.vault.adapter.exists(this.MonthlyReportPath);
    if (!folderExists) {
      await this.app.vault.createFolder(this.MonthlyReportPath);
      new Notice('Monthly Reports folder created successfully.', 3000);
    }

    // Ensure the daily expenses folder exists
    folderExists = await this.app.vault.adapter.exists(this.DailyExpensesPath);
    if (!folderExists) {
      await this.app.vault.createFolder(this.DailyExpensesPath);
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

  // ... Possibly more methods or logic
}
