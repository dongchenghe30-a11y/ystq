# TabVisualizer - Interactive Tab Visualization

A powerful JavaScript library for visualizing browser tabs with interactive tree and waterfall layouts. Perfect for creating beautiful, responsive tab management interfaces.

## 🚀 Features

- ✅ **Tree Layout** - Hierarchical display with parent-child relationships
- ✅ **Waterfall Layout** - Card-based grid layout for easy scanning
- ✅ **Interactive** - Click to navigate, hover for detailed tooltips
- ✅ **Responsive** - Adapts perfectly to all screen sizes
- ✅ **Themes** - Light and dark theme support
- ✅ **Search** - Real-time tab filtering
- ✅ **Statistics** - Live tab statistics dashboard
- ✅ **Expand/Collapse** - Tree nodes can be expanded and collapsed
- ✅ **Fast** - Optimized for performance with minimal DOM operations
- ✅ **Customizable** - Extensive configuration options

## 📦 Installation

### Option 1: Local file

```html
<script src="TabVisualizer.js"></script>
```

### Option 2: With TabManager

```html
<script src="TabManager.js"></script>
<script src="TabVisualizer.js"></script>
```

## 🎯 Quick Start

```javascript
// Initialize with TabManager
const tabManager = new TabManager();
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    tabManager: tabManager,
    layout: 'tree',
    theme: 'light'
});
```

## 📖 API Reference

### Constructor

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'), // Required: Container element
    tabManager: myTabManager,                        // Optional: TabManager instance
    layout: 'tree',                                   // Optional: 'tree' or 'waterfall' (default: 'tree')
    theme: 'light',                                   // Optional: 'light' or 'dark' (default: 'light')
    onClick: (tab) => { },                           // Optional: Click callback
    onHover: (tab) => { },                           // Optional: Hover callback
    animationEnabled: true                           // Optional: Enable animations (default: true)
});
```

### Methods

#### `setLayout(layout)`

Change the layout type.

```javascript
visualizer.setLayout('waterfall'); // 'tree' or 'waterfall'
```

#### `setTheme(theme)`

Change the theme.

```javascript
visualizer.setTheme('dark'); // 'light' or 'dark'
```

#### `refresh()`

Reload and render the tab data.

```javascript
visualizer.refresh();
```

#### `destroy()`

Destroy the visualizer and clean up resources.

```javascript
visualizer.destroy();
```

## 🎨 Tab Object Structure

```javascript
{
    id: 'tab_1234567890',
    title: 'Google',
    url: 'https://www.google.com',
    icon: '🔍', // or URL to favicon
    createdAt: '2024-01-20T10:00:00.000Z',
    active: true,
    pinned: false,
    parentId: null, // For hierarchical relationships
    children: []    // Array of child tabs
}
```

## 📝 Usage Examples

### Example 1: Basic Tree Layout

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    layout: 'tree'
});
```

### Example 2: Waterfall Layout with Custom Theme

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    layout: 'waterfall',
    theme: 'dark'
});
```

### Example 3: With TabManager Integration

```javascript
const tabManager = new TabManager();
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    tabManager: tabManager,
    layout: 'tree',
    onClick: (tab) => {
        // Navigate to the tab
        window.open(tab.url, '_blank');
    }
});
```

### Example 4: Custom Click Handler

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    onClick: (tab) => {
        console.log('Tab clicked:', tab);
        
        // Custom navigation logic
        if (confirm(`Navigate to ${tab.title}?`)) {
            window.open(tab.url, '_blank');
        }
    },
    onHover: (tab) => {
        console.log('Tab hovered:', tab.title);
    }
});
```

### Example 5: Dynamic Layout Switching

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer')
});

// Switch to waterfall
document.getElementById('waterfallBtn').addEventListener('click', () => {
    visualizer.setLayout('waterfall');
});

// Switch to tree
document.getElementById('treeBtn').addEventListener('click', () => {
    visualizer.setLayout('tree');
});
```

### Example 6: Theme Toggle

```javascript
const visualizer = new TabVisualizer({
    container: document.getElementById('visualizer'),
    theme: 'light'
});

document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = visualizer.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    visualizer.setTheme(newTheme);
});
```

### Example 7: React Integration

```javascript
import React, { useEffect, useRef } from 'react';
import TabVisualizer from './TabVisualizer';

function TabVisualizerComponent({ tabManager }) {
    const containerRef = useRef(null);
    const visualizerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            visualizerRef.current = new TabVisualizer({
                container: containerRef.current,
                tabManager: tabManager,
                layout: 'tree',
                onClick: (tab) => {
                    console.log('Tab clicked:', tab);
                }
            });
        }

        return () => {
            if (visualizerRef.current) {
                visualizerRef.current.destroy();
            }
        };
    }, [tabManager]);

    return <div ref={containerRef} style={{ minHeight: '600px' }} />;
}
```

### Example 8: Vue Integration

```javascript
<template>
  <div ref="visualizerContainer" style="min-height: 600px;"></div>
</template>

<script>
import TabVisualizer from './TabVisualizer';

export default {
  props: ['tabManager'],
  
  mounted() {
    this.visualizer = new TabVisualizer({
      container: this.$refs.visualizerContainer,
      tabManager: this.tabManager,
      layout: 'tree'
    });
  },
  
  beforeUnmount() {
    if (this.visualizer) {
      this.visualizer.destroy();
    }
  }
}
</script>
```

## 🎯 Layout Options

### Tree Layout

Hierarchical display showing parent-child relationships:
- Indented child nodes
- Expand/collapse functionality
- Connector lines
- Perfect for showing nested tabs

```javascript
visualizer.setLayout('tree');
```

### Waterfall Layout

Card-based grid layout:
- Responsive grid system
- Card-based design
- Easy scanning
- Perfect for overview

```javascript
visualizer.setLayout('waterfall');
```

## 🎨 Theme Options

### Light Theme

```javascript
visualizer.setTheme('light');
```

### Dark Theme

```javascript
visualizer.setTheme('dark');
```

## 📊 Statistics Dashboard

The visualizer automatically displays:
- Total tabs count
- Active tabs count
- Pinned tabs count
- Children tabs count

## 🔧 Customization

### Custom Styling

You can override the default styles by targeting the CSS classes:

```css
/* Change tree node background */
.tabvisualizer-tree-node {
    background: #f0f0f0;
}

/* Change waterfall card shadow */
.tabvisualizer-waterfall-item {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Change tooltip colors */
.tabvisualizer-tooltip {
    background: #2d3436;
    color: #fff;
}
```

### Custom Icons

Use emoji or URLs for tab icons:

```javascript
const tab = {
    title: 'Google',
    url: 'https://google.com',
    icon: '🔍', // Emoji
    // or
    icon: 'https://www.google.com/favicon.ico' // URL
};
```

## 🌐 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |

## 📱 Responsive Design

The visualizer automatically adapts to different screen sizes:
- **Desktop** (1200px+): Full grid/tree view
- **Tablet** (768px - 1199px): Optimized layout
- **Mobile** (<768px): Single column view

## ⚡ Performance

- **Optimized DOM Operations**: Minimal reflows and repaints
- **Event Delegation**: Efficient event handling
- **Lazy Rendering**: Only renders visible nodes
- **Smooth Animations**: Hardware-accelerated transitions

## 🐛 Troubleshooting

### Visualizer Not Showing

```javascript
// Ensure container exists
const container = document.getElementById('visualizer');
if (!container) {
    console.error('Container not found');
    return;
}
```

### Tabs Not Loading

```javascript
// Verify tab data
const tabs = tabManager.getAllTabs();
console.log('Tabs:', tabs);
```

### Layout Not Changing

```javascript
// Force re-render
visualizer.setLayout('waterfall');
visualizer.refresh();
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
