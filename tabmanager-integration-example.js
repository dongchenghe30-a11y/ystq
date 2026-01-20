/**
 * TabManager Integration Examples
 * 
 * IMPORTANT: This file contains multiple framework examples.
 * Each example should be copied to a separate file or used selectively
 * based on your project's framework choice.
 * 
 * Available Examples:
 * - Example 1: Basic Integration (Vanilla JS)
 * - Example 2: React Integration
 * - Example 3: Vue Integration
 * - Example 4: Angular Integration
 * - Example 5: Svelte Integration
 * - Example 6: Vanilla JS with Custom UI
 * - Example 7: Browser Extension Integration
 * - Example 8: Advanced Usage with State Management
 * 
 * Select the appropriate example and copy it to your project.
 */

// Example 1: Basic Integration
// ============================================

class TabManagerIntegration {
    constructor() {
        this.tabManager = new TabManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTabs();
    }

    setupEventListeners() {
        // Listen for tab events
        this.tabManager.on('tabCreated', (tab) => {
            console.log('New tab created:', tab);
            this.renderTabs();
        });

        this.tabManager.on('tabClosed', (tab) => {
            console.log('Tab closed:', tab);
            this.renderTabs();
        });
    }

    renderTabs() {
        const tabs = this.tabManager.getAllTabs();
        // Render tabs to your UI
        this.updateUI(tabs);
    }

    updateUI(tabs) {
        // Your UI update logic here
        console.log('Rendering', tabs.length, 'tabs');
    }
}

// Example 2: React Integration
// ============================================
// 
// NOTE: This example requires React and must be in a .jsx or .tsx file,
// or used with a build system like Vite, Webpack, or Create React App.
// 
// Installation:
// npm install react
// 
// Copy the following code into your React component file:

// import React, { useState, useEffect } from 'react';

function TabManagerComponent() {
    const [tabs, setTabs] = useState([]);
    const [tabManager] = useState(() => new TabManager());

    useEffect(() => {
        // Load tabs on mount
        setTabs(tabManager.getAllTabs());

        // Listen for tab events
        const handleTabCreated = (tab) => {
            setTabs(prev => [...prev, tab]);
        };

        const handleTabClosed = (tab) => {
            setTabs(prev => prev.filter(t => t.id !== tab.id));
        };

        tabManager.on('tabCreated', handleTabCreated);
        tabManager.on('tabClosed', handleTabClosed);

        return () => {
            tabManager.off('tabCreated', handleTabCreated);
            tabManager.off('tabClosed', handleTabClosed);
        };
    }, [tabManager]);

    const createTab = async (title, url) => {
        try {
            await tabManager.createTab({ title, url });
        } catch (error) {
            console.error('Failed to create tab:', error);
        }
    };

    const closeTab = async (tabId) => {
        try {
            await tabManager.closeTab(tabId);
        } catch (error) {
            console.error('Failed to close tab:', error);
        }
    };

    return (
        <div>
            <h2>Tab Manager</h2>
            <button onClick={() => createTab('Google', 'https://google.com')}>
                Create Tab
            </button>
            <ul>
                {tabs.map(tab => (
                    <li key={tab.id}>
                        {tab.title}
                        <button onClick={() => closeTab(tab.id)}>Close</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Example 3: Vue Integration
// ============================================

import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useTabManager() {
    const tabManager = new TabManager();
    const tabs = ref([]);

    const loadTabs = () => {
        tabs.value = tabManager.getAllTabs();
    };

    const createTab = async (title, url) => {
        await tabManager.createTab({ title, url });
    };

    const closeTab = async (tabId) => {
        await tabManager.closeTab(tabId);
    };

    onMounted(() => {
        loadTabs();
        
        const handleTabCreated = (tab) => {
            tabs.value.push(tab);
        };

        const handleTabClosed = (tab) => {
            tabs.value = tabs.value.filter(t => t.id !== tab.id);
        };

        tabManager.on('tabCreated', handleTabCreated);
        tabManager.on('tabClosed', handleTabClosed);
    });

    return {
        tabs,
        createTab,
        closeTab
    };
}

// Example 4: Angular Integration
// ============================================

import { Injectable, NgZone } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TabManagerService {
    // private tabManager: TabManager;
    // private tabs: any[] = [];
    tabManager;
    tabs = [];

    // constructor(private ngZone: NgZone) {
    constructor(ngZone) {
        this.tabManager = new TabManager();
        this.ngZone = ngZone;
        this.init();
    }

    init() {
        this.tabs = this.tabManager.getAllTabs();

        this.tabManager.on('tabCreated', (tab) => {
            this.ngZone.run(() => {
                this.tabs.push(tab);
            });
        });

        this.tabManager.on('tabClosed', (tab) => {
            this.ngZone.run(() => {
                this.tabs = this.tabs.filter(t => t.id !== tab.id);
            });
        });
    }

    // async createTab(title: string, url: string) {
    async createTab(title, url) {
        await this.tabManager.createTab({ title, url });
    }

    // async closeTab(tabId: string) {
    async closeTab(tabId) {
        await this.tabManager.closeTab(tabId);
    }

    getTabs() {
        return this.tabs;
    }
}

// Example 5: Svelte Integration
// ============================================

import { onMount } from 'svelte';

let tabs = [];
const tabManager = new TabManager();

onMount(() => {
    tabs = tabManager.getAllTabs();

    const handleTabCreated = (tab) => {
        tabs = [...tabs, tab];
    };

    const handleTabClosed = (tab) => {
        tabs = tabs.filter(t => t.id !== tab.id);
    };

    tabManager.on('tabCreated', handleTabCreated);
    tabManager.on('tabClosed', handleTabClosed);

    return () => {
        tabManager.off('tabCreated', handleTabCreated);
        tabManager.off('tabClosed', handleTabClosed);
    };
});

// Example 6: Vanilla JS with Custom UI
// ============================================

class TabManagerUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tabManager = new TabManager();
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.tabManager.on('tabCreated', () => this.render());
        this.tabManager.on('tabClosed', () => this.render());
        this.tabManager.on('tabUpdated', () => this.render());
    }

    render() {
        const tabs = this.tabManager.getAllTabs();
        const activeTab = this.tabManager.getActiveTab();

        this.container.innerHTML = `
            <div class="tab-manager">
                <div class="tab-controls">
                    <button id="createTabBtn">Create Tab</button>
                    <button id="clearAllBtn">Clear All</button>
                </div>
                <div class="tab-list">
                    ${tabs.map(tab => `
                        <div class="tab-item ${tab.active ? 'active' : ''}">
                            <img src="${this.escapeHtml(tab.icon)}" alt="" class="tab-icon">
                            <span class="tab-title">${this.escapeHtml(tab.title)}</span>
                            <span class="tab-url">${this.escapeHtml(tab.url)}</span>
                            <button class="tab-action activate" data-id="${this.escapeHtml(tab.id)}">Activate</button>
                            <button class="tab-action close" data-id="${this.escapeHtml(tab.id)}">Close</button>
                        </div>
                    `).join('')}
                </div>
                <div class="tab-stats">
                    Total: ${tabs.length} | Active: ${tabs.filter(t => t.active).length}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.container.querySelector('#createTabBtn')?.addEventListener('click', () => {
            const title = prompt('Tab title:');
            const url = prompt('Tab URL:');
            if (title && url) {
                this.tabManager.createTab({ title, url });
            }
        });

        this.container.querySelector('#clearAllBtn')?.addEventListener('click', () => {
            if (confirm('Clear all tabs?')) {
                this.tabManager.clearAllTabs();
            }
        });

        this.container.querySelectorAll('.tab-action.activate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.id;
                this.tabManager.activateTab(tabId);
            });
        });

        this.container.querySelectorAll('.tab-action.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.id;
                this.tabManager.closeTab(tabId);
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the UI
// new TabManagerUI('tab-manager-container');

// Example 7: Browser Extension Integration
// ============================================

// This is for browser extensions that have access to chrome.tabs API

class ExtensionTabManager {
    constructor() {
        this.tabManager = new TabManager();
        this.init();
    }

    async init() {
        // Sync with browser tabs
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            const tabs = await this.getAllBrowserTabs();
            tabs.forEach(tab => {
                this.tabManager.createTab({
                    title: tab.title,
                    url: tab.url,
                    active: tab.active
                });
            });
        }
    }

    async getAllBrowserTabs() {
        return new Promise((resolve) => {
            chrome.tabs.query({}, resolve);
        });
    }

    async openExtensionTab(title, url) {
        // Open tab using extension API
        const tab = await chrome.tabs.create({ url });
        
        // Track with TabManager
        await this.tabManager.createTab({
            title,
            url,
            active: true
        });
    }
}

// Example 8: Advanced Usage with State Management
// ============================================

class AdvancedTabManager {
    constructor() {
        this.tabManager = new TabManager();
        this.state = {
            tabs: [],
            filter: '',
            sortBy: 'createdAt',
            view: 'grid'
        };
        
        this.init();
    }

    init() {
        this.loadState();
        this.setupEventListeners();
        this.render();
    }

    loadState() {
        // Load tabs
        this.state.tabs = this.tabManager.getAllTabs();
        
        // Load filter from localStorage
        const savedFilter = localStorage.getItem('tabmanager_filter');
        if (savedFilter) {
            this.state.filter = savedFilter;
        }
    }

    setupEventListeners() {
        this.tabManager.on('tabCreated', (tab) => {
            this.state.tabs.push(tab);
            this.render();
        });

        this.tabManager.on('tabClosed', (tab) => {
            this.state.tabs = this.state.tabs.filter(t => t.id !== tab.id);
            this.render();
        });
    }

    getFilteredAndSortedTabs() {
        let tabs = [...this.state.tabs];
        
        // Apply filter
        if (this.state.filter) {
            tabs = tabs.filter(tab => 
                tab.title.toLowerCase().includes(this.state.filter.toLowerCase()) ||
                tab.url.toLowerCase().includes(this.state.filter.toLowerCase())
            );
        }
        
        // Apply sort
        tabs.sort((a, b) => {
            switch (this.state.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'createdAt':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
        
        return tabs;
    }

    setFilter(filter) {
        this.state.filter = filter;
        localStorage.setItem('tabmanager_filter', filter);
        this.render();
    }

    setSortBy(sortBy) {
        this.state.sortBy = sortBy;
        this.render();
    }

    render() {
        const tabs = this.getFilteredAndSortedTabs();
        // Render your UI with filtered and sorted tabs
        console.log('Rendering', tabs.length, 'tabs');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TabManagerIntegration,
        useTabManager,
        TabManagerUI,
        ExtensionTabManager,
        AdvancedTabManager
    };
}
