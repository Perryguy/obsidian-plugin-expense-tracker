// src/FinanceTrackerModal.ts
import { Modal, App } from 'obsidian';
import { createRoot } from 'react-dom/client';
import React from 'react';
import FinanceTracker from './FinanceTrackerView';
import Plugin from '../main';

class FinanceTrackerModal extends Modal {
  plugin: Plugin;
  root: ReturnType<typeof createRoot> | null = null;

  constructor(app: App, plugin: Plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    // Using createRoot to manage the root for the react component.
    this.root = createRoot(this.contentEl);
    this.root.render(React.createElement(FinanceTracker, { plugin: this.plugin }));

  }

  onClose() {
    // Cleanup when the modal is closed.
    this.root?.unmount();
    this.root = null;
  }
}

export default FinanceTrackerModal;
