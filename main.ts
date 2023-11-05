import { Plugin, Notice  } from 'obsidian';
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
  salary: 0// YYYY-MM-DD format
  // Set other default values here
};

export default class MyReactPlugin extends Plugin {
  onload(): void {
    const container = this.addStatusBarItem();
    // Using React.createElement instead of JSX
    root.render(React.createElement(MyComponent));
  }

  onunload(): void {
    // Cleanup for when the plugin is disabled
    const container = this.addStatusBarItem();
    const root = createRoot(container);
    root.unmount(); // Replace ReactDOM.unmountComponentAtNode(container)
  }
}


}
