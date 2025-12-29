/* content of js/app.js */
import { MCP_TOOL } from './data.js';

class App {
    constructor() {
        this.state = {
            mcp: { ...MCP_TOOL },
            currentTab: 'schema'
        };
        this.init();
    }

    init() {
        this.renderOverview();
        this.setupTabs();
        this.loadModule('schema'); // Load default module

        // Mock global event bus event
        window.addEventListener('mcp:status-change', (e) => {
            this.updateStatus(e.detail.status);
        });
    }

    renderOverview() {
        const overviewArea = document.getElementById('overview-area');
        // We will implement the proper HTML structure for the overview card here
        // For now, let's just create a placeholder container or load from a module.
        // In a real app, this might be a separate component file.
        // We will dynamically import the overview module logic later.
        import('./modules/overview.js').then(module => {
            module.render(overviewArea, this.state.mcp);
        });
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                this.switchTab(target);
            });
        });
    }

    switchTab(tabId) {
        // UI Updates
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`panel-${tabId}`).classList.add('active');

        this.state.currentTab = tabId;
        this.loadModule(tabId);
    }

    loadModule(moduleId) {
        const container = document.getElementById(`panel-${moduleId}`);
        if (container.childElementCount > 0) return; // Already loaded

        const modulePath = `./modules/${moduleId}.js`;
        // In a real bundler setup, we might map these differently.
        // For standard ES modules, dynamic import works.
        // We need to ensure these files exist though!

        // Placeholder loader
        container.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-secondary)">Loading...</div>';

        import(modulePath).then(module => {
            container.innerHTML = '';
            module.init(container, this.state);
        }).catch(err => {
            console.error(`Failed to load module ${moduleId}`, err);
            container.innerHTML = `<div style="color:var(--color-error)">Error loading module: ${err.message}</div>`;
        });
    }

    updateStatus(newStatus) {
        this.state.mcp.status = newStatus;
        this.renderOverview(); // Re-render overview to update badges
    }
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
