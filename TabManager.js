/**
 * TabManager - Browser Tab Management API
 * A lightweight library for managing browser tabs with custom titles, icons, and URLs
 * Compatible with Chrome, Firefox, Edge, and Safari
 * 
 * @version 1.0.0
 * @author TabManager
 * @license MIT
 */

class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.storageKey = 'tabmanager_tabs';
        this.init();
    }

    /**
     * Initialize TabManager
     */
    init() {
        this.loadFromStorage();
        this.setupTabEventListeners();
    }

    /**
     * Create a new tab with custom options
     * @param {Object} options - Tab configuration
     * @param {string} options.title - Tab title (required)
     * @param {string} options.url - Tab URL (required)
     * @param {string} options.icon - Tab icon URL (optional)
     * @param {boolean} options.active - Whether to activate the tab (default: true)
     * @param {boolean} options.background - Open in background (default: false)
     * @returns {Promise<Object>} Tab object with ID and properties
     */
    async createTab(options) {
        const { title, url, icon, active = true, background = false } = options;

        if (!title || !url) {
            throw new Error('Title and URL are required parameters');
        }

        try {
            const tabId = await this.openBrowserTab(url, active, background);
            
            const tab = {
                id: tabId,
                title,
                url,
                icon: icon || this.getDefaultIcon(url),
                active,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.tabs.push(tab);
            if (active) {
                this.activeTabId = tabId;
            }
            
            this.saveToStorage();
            this.dispatchEvent('tabCreated', tab);
            
            return tab;
        } catch (error) {
            console.error('Failed to create tab:', error);
            throw error;
        }
    }

    /**
     * Open a browser tab using window.open
     * @private
     */
    openBrowserTab(url, title = '', _active = true, background = false) {
        return new Promise((resolve, reject) => {
            try {
                // Browser compatibility check
                if (typeof window.open === 'undefined') {
                    reject(new Error('window.open is not available in this environment'));
                    return;
                }

                const windowName = '_blank'; // Always open in new window
                const windowFeatures = background ? 'width=800,height=600,left=-9999,top=-9999' : '';
                
                const newWindow = window.open(url, windowName, windowFeatures);
                
                if (newWindow) {
                    // Set document title if same-origin
                    if (this.isSameOrigin(url)) {
                        newWindow.onload = () => {
                            newWindow.document.title = title;
                        };
                    }
                    
                    // Generate unique ID
                    const tabId = this.generateTabId();
                    newWindow.tabManagerId = tabId;
                    
                    // Track tab close event
                    newWindow.addEventListener('beforeunload', () => {
                        this.onTabClosed(tabId);
                    });
                    
                    resolve(tabId);
                } else {
                    reject(new Error('Popup blocked by browser. Please allow popups for this site.'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update an existing tab
     * @param {string} tabId - Tab ID to update
     * @param {Object} updates - Properties to update
     * @returns {Promise<Object>} Updated tab object
     */
    async updateTab(tabId, updates) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        // Update tab properties
        Object.assign(tab, updates, {
            updatedAt: new Date().toISOString()
        });

        // Update actual browser tab if possible
        if (updates.url && this.isSameOrigin(tab.url)) {
            const tabWindow = this.getTabWindow(tabId);
            if (tabWindow && tabWindow.location) {
                tabWindow.location.href = updates.url;
            }
        }

        if (updates.title && this.isSameOrigin(tab.url)) {
            const tabWindow = this.getTabWindow(tabId);
            if (tabWindow && tabWindow.document) {
                tabWindow.document.title = updates.title;
            }
        }

        this.saveToStorage();
        this.dispatchEvent('tabUpdated', tab);
        
        return tab;
    }

    /**
     * Close a tab by ID
     * @param {string} tabId - Tab ID to close
     * @returns {Promise<boolean>} Success status
     */
    async closeTab(tabId) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        const tabWindow = this.getTabWindow(tabId);
        
        if (tabWindow) {
            tabWindow.close();
        }

        this.onTabClosed(tabId);
        return true;
    }

    /**
     * Handle tab closed event
     * @private
     */
    onTabClosed(tabId) {
        const index = this.tabs.findIndex(t => t.id === tabId);
        
        if (index !== -1) {
            const tab = this.tabs[index];
            this.tabs.splice(index, 1);
            
            if (this.activeTabId === tabId) {
                this.activeTabId = this.tabs.length > 0 ? this.tabs[this.tabs.length - 1].id : null;
            }
            
            this.saveToStorage();
            this.dispatchEvent('tabClosed', tab);
        }
    }

    /**
     * Activate a tab by ID
     * @param {string} tabId - Tab ID to activate
     * @returns {Promise<Object>} Activated tab object
     */
    async activateTab(tabId) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        const tabWindow = this.getTabWindow(tabId);
        
        if (tabWindow) {
            tabWindow.focus();
        }

        this.activeTabId = tabId;
        this.tabs.forEach(t => t.active = (t.id === tabId));
        
        this.saveToStorage();
        this.dispatchEvent('tabActivated', tab);
        
        return tab;
    }

    /**
     * Get all tabs
     * @returns {Array} Array of all tabs
     */
    getAllTabs() {
        return [...this.tabs];
    }

    /**
     * Get a tab by ID
     * @param {string} tabId - Tab ID to retrieve
     * @returns {Object|null} Tab object or null
     */
    getTabById(tabId) {
        return this.tabs.find(t => t.id === tabId) || null;
    }

    /**
     * Get the active tab
     * @returns {Object|null} Active tab object or null
     */
    getActiveTab() {
        return this.getTabById(this.activeTabId);
    }

    /**
     * Get tabs filtered by criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered tabs
     */
    getFilteredTabs(filters = {}) {
        return this.tabs.filter(tab => {
            if (filters.title && !tab.title.includes(filters.title)) return false;
            if (filters.url && !tab.url.includes(filters.url)) return false;
            if (filters.active !== undefined && tab.active !== filters.active) return false;
            return true;
        });
    }

    /**
     * Reorder tabs
     * @param {Array} tabIds - Array of tab IDs in desired order
     * @returns {Array} Reordered tabs
     */
    reorderTabs(tabIds) {
        if (!Array.isArray(tabIds)) {
            throw new Error('tabIds must be an array');
        }
        
        const tabMap = new Map(this.tabs.map(t => [t.id, t]));
        this.tabs = tabIds.map(id => tabMap.get(id)).filter(Boolean);
        
        this.saveToStorage();
        this.dispatchEvent('tabsReordered', this.tabs);
        
        return this.tabs;
    }

    /**
     * Duplicate a tab
     * @param {string} tabId - Tab ID to duplicate
     * @returns {Promise<Object>} New tab object
     */
    async duplicateTab(tabId) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        return this.createTab({
            title: tab.title,
            url: tab.url,
            icon: tab.icon,
            active: true
        });
    }

    /**
     * Pin a tab (mark as important)
     * @param {string} tabId - Tab ID to pin
     * @returns {Object} Updated tab
     */
    pinTab(tabId) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        tab.pinned = true;
        this.saveToStorage();
        this.dispatchEvent('tabPinned', tab);
        
        return tab;
    }

    /**
     * Unpin a tab
     * @param {string} tabId - Tab ID to unpin
     * @returns {Object} Updated tab
     */
    unpinTab(tabId) {
        const tab = this.getTabById(tabId);
        
        if (!tab) {
            throw new Error(`Tab with ID ${tabId} not found`);
        }

        tab.pinned = false;
        this.saveToStorage();
        this.dispatchEvent('tabUnpinned', tab);
        
        return tab;
    }

    /**
     * Clear all tabs
     * @returns {Promise<boolean>} Success status
     */
    async clearAllTabs() {
        const tabIds = this.tabs.map(t => t.id);
        
        for (const tabId of tabIds) {
            await this.closeTab(tabId);
        }
        
        return true;
    }

    /**
     * Get browser tab window
     * @private
     */
    getTabWindow(tabId) {
        // Note: This is a simplified implementation
        // In a real browser extension, use chrome.tabs or browser.tabs API
        // In a web page context, we cannot reliably reference opened windows
        // This method always returns null in standard web context
        return null;
    }

    /**
     * Check if URL is same origin
     * @private
     */
    isSameOrigin(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.origin === window.location.origin;
        } catch (error) {
            console.error('Error checking same origin:', error);
            return false;
        }
    }

    /**
     * Get default icon for URL
     * @private
     */
    getDefaultIcon(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.origin}/favicon.ico`;
        } catch (error) {
            console.error('Error getting default icon:', error);
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 12H7v-2h2v2zm0-3H7V4h2v5z"/></svg>';
        }
    }

    /**
     * Generate unique tab ID
     * @private
     */
    generateTabId() {
        return `tab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Save tabs to storage
     * @private
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.tabs));
        } catch (error) {
            console.error('Failed to save tabs to storage:', error);
            // Dispatch storage error event for UI to handle
            this.dispatchEvent('storageError', {
                error,
                message: 'Failed to save tabs to localStorage. Check available storage space.'
            });
        }
    }

    /**
     * Load tabs from storage
     * @private
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.tabs = JSON.parse(stored);
                const activeTab = this.tabs.find(t => t.active);
                this.activeTabId = activeTab ? activeTab.id : null;
            }
        } catch (error) {
            console.error('Failed to load tabs from storage:', error);
            this.tabs = [];
        }
    }

    /**
     * Setup event listeners
     * @private
     */
    setupTabEventListeners() {
        // Handle beforeunload to save state as final backup
        this.beforeUnloadHandler = () => {
            this.saveToStorage();
        };
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        
        // Optional: Also save on visibility change for SPA applications
        this.visibilityChangeHandler = () => {
            if (document.visibilityState === 'hidden') {
                this.saveToStorage();
            }
        };
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    /**
     * Cleanup event listeners
     * Call this when destroying the TabManager instance
     */
    destroy() {
        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        }
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        }
    }

    /**
     * Dispatch custom event
     * @private
     */
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`tabmanager:${eventName}`, {
            detail: data
        });
        window.dispatchEvent(event);
    }

    /**
     * Add event listener
     * @param {string} eventName - Event name (without 'tabmanager:' prefix)
     * @param {Function} callback - Event callback
     */
    on(eventName, callback) {
        window.addEventListener(`tabmanager:${eventName}`, callback);
    }

    /**
     * Remove event listener
     * @param {string} eventName - Event name
     * @param {Function} callback - Event callback
     */
    off(eventName, callback) {
        window.removeEventListener(`tabmanager:${eventName}`, callback);
    }

    /**
     * Export tabs data
     * @returns {string} JSON string of tabs data
     */
    exportTabs() {
        return JSON.stringify(this.tabs, null, 2);
    }

    /**
     * Import tabs data
     * @param {string} data - JSON string of tabs data
     * @returns {number} Number of imported tabs
     */
    importTabs(data) {
        try {
            const importedTabs = JSON.parse(data);
            
            if (!Array.isArray(importedTabs)) {
                throw new Error('Invalid data format');
            }

            this.tabs = [...this.tabs, ...importedTabs];
            this.saveToStorage();
            
            return importedTabs.length;
        } catch (error) {
            throw new Error(`Failed to import tabs: ${error.message}`);
        }
    }

    /**
     * Get tab statistics
     * @returns {Object} Tab statistics
     */
    getStatistics() {
        return {
            total: this.tabs.length,
            active: this.tabs.filter(t => t.active).length,
            pinned: this.tabs.filter(t => t.pinned).length,
            oldest: this.tabs.length > 0 ? this.tabs[this.tabs.length - 1].createdAt : null,
            newest: this.tabs.length > 0 ? this.tabs[0].createdAt : null
        };
    }
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
    window.TabManager = TabManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabManager;
}
