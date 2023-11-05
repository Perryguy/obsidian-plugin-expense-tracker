// main.ts
import { Plugin } from 'obsidian';
import { createRoot } from 'react-dom/client';
import MyComponent from './src/ReactView';
import React from 'react';

export default class MyReactPlugin extends Plugin {
  onload(): void {
    const container = this.addStatusBarItem();
    const root = createRoot(container); // Create a root.
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
