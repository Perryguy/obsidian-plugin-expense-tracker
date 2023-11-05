import {App, PluginSettingTab, Setting } from 'obsidian';
import FinanceTrackerPlugin, { DEFAULT_SETTINGS } from '../main';

export default class SampleSettingTab extends PluginSettingTab {
    plugin: FinanceTrackerPlugin;

    constructor(app: App, plugin: FinanceTrackerPlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }
  
    display(): void {
      const { containerEl } = this;
  
      containerEl.empty();
      
      containerEl.createEl('h2', { text: 'Settings for My Plugin' });
      
      // Budget setting
      new Setting(containerEl)
        .setName('Monthly Budget')
        .setDesc('Set your monthly budget')
        .addText(text => text
          .setPlaceholder('Enter your budget')
          .setValue(this.plugin.settings.monthlyBudget.toString())
          .onChange(async (value) => {
            this.plugin.settings.monthlyBudget = parseInt(value.trim()) || DEFAULT_SETTINGS.monthlyBudget;
            await this.plugin.saveSettings();
          }));
      
      // Bill due day setting
      new Setting(containerEl)
        .setName('Bill Due Day')
        .setDesc('Day of the month when bills are due')
        .addText(text => text
          .setValue(this.plugin.settings.billDueDay.toString())
          .onChange(async (value) => {
            this.plugin.settings.billDueDay = parseInt(value.trim()) || DEFAULT_SETTINGS.billDueDay;
            await this.plugin.saveSettings();
          }));
  
      // Salary date setting
      new Setting(containerEl)
        .setName('Salary Date')
        .setDesc('Date when you receive your salary')
        .addText(text => text
          .setValue(this.plugin.settings.salaryDate)
          .onChange(async (value) => {
            this.plugin.settings.salaryDate = value.trim() || DEFAULT_SETTINGS.salaryDate;
            await this.plugin.saveSettings();
          }));

          new Setting(containerEl)
        .setName('Salary')
        .setDesc('Date when you receive your salary')
        .addText(text => text
          .setValue(this.plugin.settings.salary.toString())
          .onChange(async (value) => {
            this.plugin.settings.salary = parseInt(value.trim()) || DEFAULT_SETTINGS.salary;
            await this.plugin.saveSettings();
          }));
      
      // Add other settings here...
    }
  }
  