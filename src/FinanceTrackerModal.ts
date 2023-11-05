// src/FinanceTrackerModal.ts
import { Modal, App } from 'obsidian';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import FinanceTracker from './FinanceTrackerView';
import Plugin from '../main';

class FinanceTrackerModal extends Modal {
  plugin: Plugin;
  dataFilePath: string;
  root: ReturnType<typeof createRoot> | null = null;
  constructor(app: App, plugin: Plugin, dataFilePath:string) {
    super(app);
    this.plugin = plugin;
    this.dataFilePath = dataFilePath
  }

  onOpen() {
    // Using createRoot to manage the root for the react component.
    this.root = createRoot(this.contentEl);
    this.root.render(React.createElement(FinanceTracker, { plugin: this.plugin, dataFilePath: this.dataFilePath}));

  }

  onClose() {
    // Cleanup when the modal is closed.
    this.root?.unmount();
    this.root = null;
  }
}

export default FinanceTrackerModal;
