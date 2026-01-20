/**
 * TabVisualizer - Interactive Tab Visualization
 * A powerful library for visualizing browser tabs with tree/waterfall layouts
 * Supports interactive features like click navigation and hover details
 * 
 * @version 1.0.0
 * @author TabVisualizer
 * @license MIT
 */

class TabVisualizer {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.tabManager = options.tabManager || null;
        this.layout = options.layout || 'tree'; // 'tree' or 'waterfall'
        this.theme = options.theme || 'light';
        this.onClick = options.onClick || null;
        this.onHover = options.onHover || null;
        this.animationEnabled = options.animationEnabled !== false;
        
        this.tabs = [];
        this.selectedTabId = null;
        this.hoveredTabId = null;
        
        this.init();
    }

    init() {
        this.createStyles();
        this.createContainer();
        this.loadTabs();
        this.setupEventListeners();
        this.render();
    }

    /**
     * Create dynamic styles
     */
    createStyles() {
        if (document.getElementById('tabvisualizer-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'tabvisualizer-styles';
        style.textContent = `
            .tabvisualizer-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            .tabvisualizer-controls {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .tabvisualizer-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                background: #667eea;
                color: white;
            }
            
            .tabvisualizer-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .tabvisualizer-btn.active {
                background: #764ba2;
            }
            
            .tabvisualizer-layout-toggle {
                display: flex;
                background: #e9ecef;
                border-radius: 8px;
                padding: 4px;
            }
            
            .tabvisualizer-layout-btn {
                padding: 8px 16px;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .tabvisualizer-layout-btn.active {
                background: white;
                color: #667eea;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .tabvisualizer-search {
                flex: 1;
                min-width: 200px;
                max-width: 400px;
                padding: 10px 15px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 14px;
            }
            
            .tabvisualizer-search:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .tabvisualizer-chart {
                display: flex;
                gap: 20px;
                overflow: auto;
                padding: 20px;
                min-height: 400px;
            }
            
            /* Tree Layout */
            .tabvisualizer-tree {
                flex-direction: column;
            }
            
            .tabvisualizer-tree-node {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 8px;
            }
            
            .tabvisualizer-tree-node:hover {
                background: #f8f9fa;
                transform: translateX(5px);
            }
            
            .tabvisualizer-tree-node.selected {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                border-left: 4px solid #667eea;
            }
            
            .tabvisualizer-tree-children {
                margin-left: 30px;
                border-left: 2px dashed #dee2e6;
            }
            
            /* Waterfall Layout */
            .tabvisualizer-waterfall {
                flex-direction: row;
                flex-wrap: wrap;
                align-content: flex-start;
            }
            
            .tabvisualizer-waterfall-item {
                flex: 0 0 280px;
                background: white;
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
            }
            
            .tabvisualizer-waterfall-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .tabvisualizer-waterfall-item.selected {
                border: 3px solid #667eea;
            }
            
            .tabvisualizer-waterfall-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
            }
            
            /* Common Elements */
            .tabvisualizer-icon {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                background: #f8f9fa;
                flex-shrink: 0;
            }
            
            .tabvisualizer-icon img {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }
            
            .tabvisualizer-info {
                flex: 1;
                min-width: 0;
            }
            
            .tabvisualizer-title {
                font-weight: 600;
                font-size: 14px;
                color: #2d3436;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .tabvisualizer-url {
                font-size: 12px;
                color: #6c757d;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .tabvisualizer-meta {
                font-size: 11px;
                color: #adb5bd;
            }
            
            .tabvisualizer-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                margin-right: 5px;
            }
            
            .tabvisualizer-badge.active {
                background: #d4edda;
                color: #155724;
            }
            
            .tabvisualizer-badge.pinned {
                background: #fff3cd;
                color: #856404;
            }
            
            .tabvisualizer-badge.children {
                background: #d1ecf1;
                color: #0c5460;
            }
            
            /* Tooltip */
            .tabvisualizer-tooltip {
                position: fixed;
                background: #2d3436;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 13px;
                pointer-events: none;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .tabvisualizer-tooltip.visible {
                opacity: 1;
            }
            
            .tabvisualizer-tooltip-title {
                font-weight: 600;
                margin-bottom: 5px;
                color: #667eea;
            }
            
            .tabvisualizer-tooltip-row {
                margin: 3px 0;
                font-size: 12px;
                color: #b2bec3;
            }
            
            .tabvisualizer-tooltip-row strong {
                color: #dfe6e9;
            }
            
            /* Connector Lines for Tree */
            .tabvisualizer-connector {
                width: 20px;
                height: 2px;
                background: #dee2e6;
                position: absolute;
                left: -20px;
                top: 50%;
            }
            
            /* Loading State */
            .tabvisualizer-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                color: #6c757d;
            }
            
            .tabvisualizer-loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #e9ecef;
                border-top-color: #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Empty State */
            .tabvisualizer-empty {
                text-align: center;
                padding: 80px 20px;
                color: #6c757d;
            }
            
            .tabvisualizer-empty svg {
                width: 100px;
                height: 100px;
                margin-bottom: 20px;
                opacity: 0.3;
            }
            
            /* Stats Panel */
            .tabvisualizer-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .tabvisualizer-stat-card {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
            }
            
            .tabvisualizer-stat-value {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .tabvisualizer-stat-label {
                font-size: 13px;
                opacity: 0.9;
            }
            
            /* Dark Theme */
            .tabvisualizer-dark .tabvisualizer-tree-node {
                color: #dfe6e9;
            }
            
            .tabvisualizer-dark .tabvisualizer-tree-node:hover {
                background: #2d3436;
            }
            
            .tabvisualizer-dark .tabvisualizer-waterfall-item {
                background: #2d3436;
                color: #dfe6e9;
            }
            
            .tabvisualizer-dark .tabvisualizer-title {
                color: #dfe6e9;
            }
            
            .tabvisualizer-dark .tabvisualizer-url {
                color: #b2bec3;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .tabvisualizer-controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .tabvisualizer-search {
                    max-width: none;
                }
                
                .tabvisualizer-waterfall-item {
                    flex: 0 0 100%;
                }
                
                .tabvisualizer-tree-children {
                    margin-left: 15px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Create main container
     */
    createContainer() {
        const container = document.createElement('div');
        container.className = `tabvisualizer-container ${this.theme === 'dark' ? 'tabvisualizer-dark' : ''}`;
        container.innerHTML = `
            <div class="tabvisualizer-controls">
                <div class="tabvisualizer-search">
                    <input type="text" id="tabvisualizer-search" placeholder="Search tabs...">
                </div>
                <div class="tabvisualizer-layout-toggle">
                    <button class="tabvisualizer-layout-btn ${this.layout === 'tree' ? 'active' : ''}" data-layout="tree">
                        🌳 Tree
                    </button>
                    <button class="tabvisualizer-layout-btn ${this.layout === 'waterfall' ? 'active' : ''}" data-layout="waterfall">
                        🌊 Waterfall
                    </button>
                </div>
                <button class="tabvisualizer-btn" id="tabvisualizer-refresh">🔄 Refresh</button>
                <button class="tabvisualizer-btn" id="tabvisualizer-expand">📂 Expand All</button>
                <button class="tabvisualizer-btn" id="tabvisualizer-collapse">📁 Collapse All</button>
            </div>
            
            <div class="tabvisualizer-stats" id="tabvisualizer-stats"></div>
            
            <div class="tabvisualizer-chart ${this.layout === 'tree' ? 'tabvisualizer-tree' : 'tabvisualizer-waterfall'}" id="tabvisualizer-chart"></div>
        `;
        
        this.container.appendChild(container);
        this.chartContainer = container.querySelector('#tabvisualizer-chart');
        this.searchInput = container.querySelector('#tabvisualizer-search');
    }

    /**
     * Load tabs from TabManager
     */
    loadTabs() {
        if (this.tabManager) {
            this.tabs = this.tabManager.getAllTabs();
        } else {
            // Mock data for testing
            this.tabs = this.generateMockTabs();
        }
    }

    /**
     * Generate mock tabs for testing
     */
    generateMockTabs() {
        return [
            {
                id: 'tab_1',
                title: 'Google',
                url: 'https://www.google.com',
                icon: '🔍',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                active: true,
                pinned: true,
                parentId: null,
                children: []
            },
            {
                id: 'tab_2',
                title: 'GitHub - TabVisualizer',
                url: 'https://github.com/tabvisualizer',
                icon: '🐙',
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                active: false,
                pinned: false,
                parentId: null,
                children: []
            },
            {
                id: 'tab_3',
                title: 'Stack Overflow',
                url: 'https://stackoverflow.com',
                icon: '💻',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                active: false,
                pinned: false,
                parentId: null,
                children: []
            }
        ];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search
        this.searchInput.addEventListener('input', () => {
            this.render();
        });

        // Layout toggle
        this.container.querySelectorAll('.tabvisualizer-layout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.layout = e.target.dataset.layout;
                this.container.querySelectorAll('.tabvisualizer-layout-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.chartContainer.className = `tabvisualizer-chart ${this.layout === 'tree' ? 'tabvisualizer-tree' : 'tabvisualizer-waterfall'}`;
                this.render();
            });
        });

        // Refresh
        this.container.querySelector('#tabvisualizer-refresh').addEventListener('click', () => {
            this.loadTabs();
            this.render();
        });

        // Expand/Collapse (tree layout only)
        this.container.querySelector('#tabvisualizer-expand')?.addEventListener('click', () => {
            this.expandAll();
        });

        this.container.querySelector('#tabvisualizer-collapse')?.addEventListener('click', () => {
            this.collapseAll();
        });
    }

    /**
     * Render the visualization
     */
    render() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredTabs = this.getFilteredTabs(searchTerm);
        
        this.renderStats(filteredTabs);
        
        if (filteredTabs.length === 0) {
            this.renderEmpty();
            return;
        }
        
        if (this.layout === 'tree') {
            this.renderTree(filteredTabs);
        } else {
            this.renderWaterfall(filteredTabs);
        }
        
        // Setup click and hover handlers
        this.setupInteractionHandlers();
    }

    /**
     * Get filtered tabs based on search
     */
    getFilteredTabs(searchTerm) {
        if (!searchTerm) return this.tabs;
        
        return this.tabs.filter(tab => 
            tab.title.toLowerCase().includes(searchTerm) ||
            tab.url.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Render statistics
     */
    renderStats(tabs) {
        const statsContainer = this.container.querySelector('#tabvisualizer-stats');
        const stats = {
            total: tabs.length,
            active: tabs.filter(t => t.active).length,
            pinned: tabs.filter(t => t.pinned).length,
            children: tabs.reduce((sum, t) => sum + (t.children?.length || 0), 0)
        };
        
        statsContainer.innerHTML = `
            <div class="tabvisualizer-stat-card">
                <div class="tabvisualizer-stat-value">${stats.total}</div>
                <div class="tabvisualizer-stat-label">Total Tabs</div>
            </div>
            <div class="tabvisualizer-stat-card">
                <div class="tabvisualizer-stat-value">${stats.active}</div>
                <div class="tabvisualizer-stat-label">Active</div>
            </div>
            <div class="tabvisualizer-stat-card">
                <div class="tabvisualizer-stat-value">${stats.pinned}</div>
                <div class="tabvisualizer-stat-label">Pinned</div>
            </div>
            <div class="tabvisualizer-stat-card">
                <div class="tabvisualizer-stat-value">${stats.children}</div>
                <div class="tabvisualizer-stat-label">Children</div>
            </div>
        `;
    }

    /**
     * Render tree layout
     */
    renderTree(tabs) {
        this.chartContainer.innerHTML = tabs.map(tab => {
            const node = this.createTreeNode(tab, 0);
            return node.outerHTML;
        }).join('');
    }

    /**
     * Create tree node element
     */
    createTreeNode(tab, depth) {
        const div = document.createElement('div');
        div.className = `tabvisualizer-tree-node ${tab.active ? 'selected' : ''}`;
        div.dataset.tabId = tab.id;
        
        const badges = [];
        if (tab.active) badges.push('<span class="tabvisualizer-badge active">Active</span>');
        if (tab.pinned) badges.push('<span class="tabvisualizer-badge pinned">Pinned</span>');
        if (tab.children?.length) badges.push(`<span class="tabvisualizer-badge children">${tab.children.length} Children</span>`);
        
        div.innerHTML = `
            <div class="tabvisualizer-icon">${this.renderIcon(tab.icon)}</div>
            <div class="tabvisualizer-info">
                <div class="tabvisualizer-title">${this.escapeHtml(tab.title)}</div>
                <div class="tabvisualizer-url">${this.escapeHtml(tab.url)}</div>
                <div class="tabvisualizer-meta">
                    ${badges.join('')}
                    Opened: ${this.formatDate(tab.createdAt)}
                </div>
            </div>
        `;
        
        // Render children
        if (tab.children && tab.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tabvisualizer-tree-children';
            tab.children.forEach(child => {
                childrenContainer.appendChild(this.createTreeNode(child, depth + 1));
            });
            div.appendChild(childrenContainer);
        }
        
        return div;
    }

    /**
     * Render waterfall layout
     */
    renderWaterfall(tabs) {
        this.chartContainer.innerHTML = tabs.map(tab => `
            <div class="tabvisualizer-waterfall-item ${tab.active ? 'selected' : ''}" data-tab-id="${tab.id}">
                <div class="tabvisualizer-icon">${this.renderIcon(tab.icon)}</div>
                <div class="tabvisualizer-info">
                    <div class="tabvisualizer-title">${this.escapeHtml(tab.title)}</div>
                    <div class="tabvisualizer-url">${this.escapeHtml(tab.url)}</div>
                    <div class="tabvisualizer-meta">
                        ${tab.active ? '<span class="tabvisualizer-badge active">Active</span>' : ''}
                        ${tab.pinned ? '<span class="tabvisualizer-badge pinned">Pinned</span>' : ''}
                        Opened: ${this.formatDate(tab.createdAt)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.chartContainer.innerHTML = `
            <div class="tabvisualizer-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
                <h3>No tabs found</h3>
                <p>Create some tabs or adjust your search</p>
            </div>
        `;
    }

    /**
     * Setup interaction handlers
     */
    setupInteractionHandlers() {
        // Click handlers
        this.chartContainer.querySelectorAll('[data-tab-id]').forEach(element => {
            element.addEventListener('click', (e) => {
                const tabId = element.dataset.tabId;
                const tab = this.tabs.find(t => t.id === tabId);
                
                if (tab) {
                    this.selectTab(tabId);
                    if (this.onClick) {
                        this.onClick(tab);
                    } else {
                        this.navigateToTab(tab);
                    }
                }
            });
        });

        // Hover handlers
        this.chartContainer.querySelectorAll('[data-tab-id]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tabId = element.dataset.tabId;
                const tab = this.tabs.find(t => t.id === tabId);
                
                if (tab) {
                    this.showTooltip(e, tab);
                    if (this.onHover) {
                        this.onHover(tab);
                    }
                }
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Select a tab
     */
    selectTab(tabId) {
        this.selectedTabId = tabId;
        this.chartContainer.querySelectorAll('[data-tab-id]').forEach(el => {
            el.classList.toggle('selected', el.dataset.tabId === tabId);
        });
    }

    /**
     * Navigate to tab
     */
    navigateToTab(tab) {
        if (tab.url) {
            window.open(tab.url, '_blank');
        }
    }

    /**
     * Show tooltip
     */
    showTooltip(event, tab) {
        let tooltip = document.querySelector('.tabvisualizer-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tabvisualizer-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.innerHTML = `
            <div class="tabvisualizer-tooltip-title">${this.escapeHtml(tab.title)}</div>
            <div class="tabvisualizer-tooltip-row"><strong>URL:</strong> ${this.escapeHtml(tab.url)}</div>
            <div class="tabvisualizer-tooltip-row"><strong>Created:</strong> ${new Date(tab.createdAt).toLocaleString()}</div>
            <div class="tabvisualizer-tooltip-row"><strong>Status:</strong> ${tab.active ? 'Active' : 'Inactive'}</div>
            ${tab.pinned ? '<div class="tabvisualizer-tooltip-row"><strong>Pinned:</strong> Yes</div>' : ''}
        `;
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;
        tooltip.classList.add('visible');
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.querySelector('.tabvisualizer-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    /**
     * Expand all nodes (tree layout)
     */
    expandAll() {
        this.chartContainer.querySelectorAll('.tabvisualizer-tree-children').forEach(el => {
            el.style.display = 'block';
        });
    }

    /**
     * Collapse all nodes (tree layout)
     */
    collapseAll() {
        this.chartContainer.querySelectorAll('.tabvisualizer-tree-children').forEach(el => {
            el.style.display = 'none';
        });
    }

    /**
     * Set layout
     */
    setLayout(layout) {
        this.layout = layout;
        this.chartContainer.className = `tabvisualizer-chart ${layout === 'tree' ? 'tabvisualizer-tree' : 'tabvisualizer-waterfall'}`;
        this.render();
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.theme = theme;
        this.container.classList.toggle('tabvisualizer-dark', theme === 'dark');
    }

    /**
     * Refresh data
     */
    refresh() {
        this.loadTabs();
        this.render();
    }

    /**
     * Render icon
     */
    renderIcon(icon) {
        if (icon.startsWith('http')) {
            return `<img src="${icon}" alt="" onerror="this.parentElement.textContent='📄'">`;
        }
        return icon || '📄';
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Destroy the visualizer
     */
    destroy() {
        const tooltip = document.querySelector('.tabvisualizer-tooltip');
        if (tooltip) tooltip.remove();
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
    window.TabVisualizer = TabVisualizer;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabVisualizer;
}
