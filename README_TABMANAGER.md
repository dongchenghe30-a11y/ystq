# TabManager - Browser Tab Management API

A powerful, lightweight JavaScript library for creating and managing browser tabs with custom titles, icons, and URLs. Compatible with all modern browsers.

## 🚀 Features

- ✅ Create tabs with custom titles, icons, and URLs
- ✅ Update, close, and activate tabs programmatically
- ✅ Pin and unpin important tabs
- ✅ Duplicate existing tabs
- ✅ Filter and search tabs
- ✅ Reorder tabs
- ✅ Export/Import tab configurations
- ✅ Event-driven architecture with real-time updates
- ✅ LocalStorage persistence
- ✅ Browser statistics and analytics
- ✅ Cross-browser compatibility (Chrome, Firefox, Edge, Safari)

## 📦 Installation

### Option 1: Local file (Recommended)

```html
<script src="TabManager.js"></script>
```

## 🎯 Quick Start

```javascript
// Initialize TabManager
const tabManager = new TabManager();

// Create a new tab
const tab = await tabManager.createTab({
    title: 'Google',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    active: true
});

console.log('Tab created:', tab);
```

## 📖 API Reference

### Methods

#### `createTab(options)`

Create a new browser tab with custom properties.

```javascript
const tab = await tabManager.createTab({
    title: 'GitHub',        // Required
    url: 'https://github.com', // Required
    icon: 'https://github.com/favicon.ico', // Optional
    active: true,           // Optional (default: true)
    background: false       // Optional (default: false)
});
```

#### `updateTab(tabId, updates)`

Update an existing tab's properties.

```javascript
await tabManager.updateTab(tab.id, {
    title: 'Updated Title',
    url: 'https://new-url.com'
});
```

#### `closeTab(tabId)`

Close a tab by its ID.

```javascript
await tabManager.closeTab(tab.id);
```

#### `activateTab(tabId)`

Activate (focus) a tab.

```javascript
await tabManager.activateTab(tab.id);
```

#### `getAllTabs()`

Get all tabs.

```javascript
const tabs = tabManager.getAllTabs();
```

#### `getFilteredTabs(filters)`

Get tabs filtered by criteria.

```javascript
const activeTabs = tabManager.getFilteredTabs({ active: true });
const googleTabs = tabManager.getFilteredTabs({ title: 'Google' });
```

#### `pinTab(tabId)` / `unpinTab(tabId)`

Pin or unpin a tab.

```javascript
tabManager.pinTab(tab.id);
tabManager.unpinTab(tab.id);
```

#### `duplicateTab(tabId)`

Create a duplicate of a tab.

```javascript
const newTab = await tabManager.duplicateTab(tab.id);
```

#### `clearAllTabs()`

Close all tabs.

```javascript
await tabManager.clearAllTabs();
```

#### `exportTabs()` / `importTabs(data)`

Export/Import tab configurations.

```javascript
const data = tabManager.exportTabs();
tabManager.importTabs(data);
```

#### `getStatistics()`

Get tab statistics.

```javascript
const stats = tabManager.getStatistics();
console.log(`Total: ${stats.total}, Active: ${stats.active}`);
```

## 📡 Events

Listen to tab events:

```javascript
// Tab created
tabManager.on('tabCreated', (tab) => {
    console.log('Tab created:', tab.title);
});

// Tab closed
tabManager.on('tabClosed', (tab) => {
    console.log('Tab closed:', tab.title);
});

// Tab updated
tabManager.on('tabUpdated', (tab) => {
    console.log('Tab updated:', tab.title);
});

// Tab activated
tabManager.on('tabActivated', (tab) => {
    console.log('Tab activated:', tab.title);
});

// Tab pinned
tabManager.on('tabPinned', (tab) => {
    console.log('Tab pinned:', tab.title);
});

// Tab unpinned
tabManager.on('tabUnpinned', (tab) => {
    console.log('Tab unpinned:', tab.title);
});
```

## 🎨 Tab Object Structure

```javascript
{
    id: 'tab_1234567890_abc123def',
    title: 'Google',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    active: true,
    pinned: false,
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z'
}
```

## 📝 Usage Examples

### Example 1: Create Multiple Tabs

```javascript
const urls = [
    'https://google.com',
    'https://github.com',
    'https://stackoverflow.com'
];

const tabs = await Promise.all(
    urls.map(url => tabManager.createTab({
        title: new URL(url).hostname,
        url
    }))
);
```

### Example 2: Tab Management Dashboard

```javascript
// Get all active tabs
const activeTabs = tabManager.getFilteredTabs({ active: true });

// Get pinned tabs
const pinnedTabs = tabManager.getAllTabs().filter(t => t.pinned);

// Close all unpinned tabs
const unpinnedTabs = tabManager.getAllTabs().filter(t => !t.pinned);
for (const tab of unpinnedTabs) {
    await tabManager.closeTab(tab.id);
}
```

### Example 3: Export and Import

```javascript
// Export to file
const data = tabManager.exportTabs();
const blob = new Blob([data], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'tabs-export.json';
a.click();

// Import from file
const response = await fetch('tabs-export.json');
const data = await response.text();
const count = tabManager.importTabs(data);
console.log(`Imported ${count} tabs`);
```

### Example 4: Event-Driven UI

```javascript
tabManager.on('tabCreated', (tab) => {
    addTabToUI(tab);
});

tabManager.on('tabClosed', (tab) => {
    removeTabFromUI(tab.id);
});

tabManager.on('tabActivated', (tab) => {
    highlightActiveTab(tab.id);
});
```

## 🌐 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |

## ⚙️ Configuration

### LocalStorage

TabManager automatically saves tabs to localStorage using the key `tabmanager_tabs`. You can customize this:

```javascript
const tabManager = new TabManager();
tabManager.storageKey = 'my_custom_key';
```

### Event Cleanup

Remove event listeners when done:

```javascript
function handleTabCreated(tab) {
    console.log('Tab created:', tab);
}

tabManager.on('tabCreated', handleTabCreated);

// Later
tabManager.off('tabCreated', handleTabCreated);
```

## 🔒 Security Notes

1. **Same-Origin Policy**: Tab operations on different domains are limited
2. **Popup Blocker**: Some browsers may block programmatic tab opening
3. **User Interaction**: Some operations require user gesture
4. **LocalStorage**: Data is stored locally and not encrypted

## 🐛 Troubleshooting

### Popup Blocked

If tabs don't open, ensure popups are allowed for your domain:

```javascript
try {
    await tabManager.createTab({ title: 'Test', url: 'https://example.com' });
} catch (error) {
    if (error.message.includes('Popup blocked')) {
        alert('Please allow popups for this site to open tabs.');
    }
}
```

### Tab Not Found

```javascript
const tab = tabManager.getTabById(tabId);
if (!tab) {
    console.error('Tab not found');
}
```

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues and questions, please open an issue on the project repository.

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-20
