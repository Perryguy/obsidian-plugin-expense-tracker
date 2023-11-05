interface MyPluginSettings {
    monthlyBudget: number;
    billDueDay: number;
    salaryDate: string;
    // Add other settings fields here
  }
const DEFAULT_SETTINGS: MyPluginSettings = {
    monthlyBudget: 1000,
    billDueDay: 1,
    salaryDate: '2023-01-01', // YYYY-MM-DD format
    // Set other default values here
  };