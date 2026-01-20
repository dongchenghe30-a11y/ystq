// Global variables
let extractedColors = [];
let currentScheme = [];

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Color Extractor
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const uploadedImage = document.getElementById('uploadedImage');
const extractBtn = document.getElementById('extractBtn');
const paletteResults = document.getElementById('paletteResults');

uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage.src = e.target.result;
        imagePreview.style.display = 'block';
        extractBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

extractBtn.addEventListener('click', () => {
    extractColors(uploadedImage);
});

function extractColors(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    
    ctx.drawImage(imgElement, 0, 0);
    
    // Resize for faster processing if image is large
    if (canvas.width * canvas.height > 250000) {
        const scale = Math.sqrt(250000 / (canvas.width * canvas.height));
        canvas.width = Math.floor(canvas.width * scale);
        canvas.height = Math.floor(canvas.height * scale);
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    }
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap = {};
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const alpha = imageData[i + 3];
        
        if (alpha < 128) continue; // Skip transparent pixels
        
        // Quantize colors to reduce noise
        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;
        
        const key = `${qr},${qg},${qb}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
    }
    
    // Sort by frequency
    const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color, count]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b, count };
        });
    
    // Get dominant color
    const dominant = sortedColors[0];
    const dominantHex = rgbToHex(dominant.r, dominant.g, dominant.b);
    
    // Get top 10 colors
    extractedColors = sortedColors.slice(0, 10).map(c => ({
        hex: rgbToHex(c.r, c.g, c.b),
        rgb: `rgb(${c.r}, ${c.g}, ${c.b})`
    }));
    
    displayDominantColor(dominantHex);
    displayColorGrid(extractedColors);
    paletteResults.style.display = 'block';
    
    // Scroll to results
    paletteResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

function displayDominantColor(hex) {
    const dominantEl = document.getElementById('dominantColor');
    dominantEl.style.background = hex;
    dominantEl.style.color = getContrastColor(hex);
    dominantEl.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">🎯</div>
            <div>${hex.toUpperCase()}</div>
            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">Dominant</div>
        </div>
    `;
}

function displayColorGrid(colors) {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';
    
    colors.forEach((color, index) => {
        const item = document.createElement('div');
        item.className = 'color-item';
        item.onclick = () => copyToClipboard(color.hex);
        
        item.innerHTML = `
            <div class="color-swatch" style="background: ${color.hex}"></div>
            <div class="color-info">
                <div class="color-hex">${color.hex.toUpperCase()}</div>
                <div class="color-rgb">${color.rgb}</div>
            </div>
        `;
        
        grid.appendChild(item);
    });
}

// Color Scheme Generator
const baseColor = document.getElementById('baseColor');
const baseColorHex = document.getElementById('baseColorHex');
const schemeType = document.getElementById('schemeType');
const generateBtn = document.getElementById('generateBtn');
const schemeGrid = document.getElementById('schemeGrid');
const schemeInfo = document.getElementById('schemeInfo');

baseColor.addEventListener('input', () => {
    baseColorHex.textContent = baseColor.value.toUpperCase();
});

generateBtn.addEventListener('click', () => {
    generateScheme();
});

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generateScheme() {
    const hex = baseColor.value;
    const hsl = hexToHsl(hex);
    const type = schemeType.value;
    
    currentScheme = [];
    
    switch (type) {
        case 'complementary':
            currentScheme = [
                { hex, name: 'Base' },
                { hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), name: 'Complementary' }
            ];
            break;
            
        case 'analogous':
            currentScheme = [
                { hex: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l), name: 'Analogous 1' },
                { hex: hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l), name: 'Analogous 2' },
                { hex, name: 'Base' },
                { hex: hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l), name: 'Analogous 3' },
                { hex: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l), name: 'Analogous 4' }
            ];
            break;
            
        case 'triadic':
            currentScheme = [
                { hex, name: 'Primary' },
                { hex: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), name: 'Secondary' },
                { hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l), name: 'Tertiary' }
            ];
            break;
            
        case 'tetradic':
            currentScheme = [
                { hex, name: 'Primary' },
                { hex: hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l), name: 'Secondary' },
                { hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), name: 'Tertiary' },
                { hex: hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l), name: 'Quaternary' }
            ];
            break;
            
        case 'monochromatic':
            currentScheme = [
                { hex: hslToHex(hsl.h, hsl.s, 20), name: 'Dark' },
                { hex: hslToHex(hsl.h, hsl.s, 40), name: 'Medium Dark' },
                { hex, name: 'Base' },
                { hex: hslToHex(hsl.h, hsl.s, 70), name: 'Medium Light' },
                { hex: hslToHex(hsl.h, hsl.s, 90), name: 'Light' }
            ];
            break;
            
        case 'split-complementary':
            currentScheme = [
                { hex, name: 'Base' },
                { hex: hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l), name: 'Split 1' },
                { hex: hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l), name: 'Split 2' }
            ];
            break;
    }
    
    displayScheme(currentScheme);
    updateSchemeInfo(type);
}

function displayScheme(scheme) {
    schemeGrid.innerHTML = '';
    
    scheme.forEach(color => {
        const item = document.createElement('div');
        item.className = 'scheme-item';
        item.onclick = () => copyToClipboard(color.hex);
        
        item.innerHTML = `
            <div class="scheme-swatch" style="background: ${color.hex}"></div>
            <div class="scheme-name">
                <div style="color: ${color.hex};">${color.name}</div>
                <div style="font-size: 0.8rem; color: #6c757d;">${color.hex.toUpperCase()}</div>
            </div>
        `;
        
        schemeGrid.appendChild(item);
    });
}

function updateSchemeInfo(type) {
    const info = {
        'complementary': 'Uses two colors that are opposite each other on the color wheel.',
        'analogous': 'Uses colors that are next to each other on the color wheel.',
        'triadic': 'Uses three colors that are evenly spaced on the color wheel.',
        'tetradic': 'Uses four colors that form a rectangle on the color wheel.',
        'monochromatic': 'Uses variations of a single color hue.',
        'split-complementary': 'Uses a base color and two colors adjacent to its complementary.'
    };
    
    schemeInfo.innerHTML = `
        <h4>📝 ${type.charAt(0).toUpperCase() + type.slice(1)} Scheme</h4>
        <p style="color: #6c757d; margin-top: 10px;">${info[type]}</p>
    `;
}

// Export Functions
function exportPalette(format) {
    if (extractedColors.length === 0) {
        showToast('No colors extracted yet!');
        return;
    }
    
    let content = '';
    const colors = extractedColors.map(c => c.hex);
    
    switch (format) {
        case 'css':
            content = colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
            content = `:root {\n${content}\n}`;
            break;
            
        case 'scss':
            content = colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
            break;
            
        case 'json':
            content = JSON.stringify(colors, null, 2);
            break;
    }
    
    downloadFile(content, `palette.${format}`, format === 'json' ? 'application/json' : 'text/plain');
    showToast(`Palette exported as ${format.toUpperCase()}!`);
}

function exportScheme(format) {
    if (currentScheme.length === 0) {
        showToast('No scheme generated yet!');
        return;
    }
    
    let content = '';
    
    switch (format) {
        case 'css':
            content = currentScheme.map((c, i) => `  --${c.name.toLowerCase().replace(' ', '-')}: ${c.hex};`).join('\n');
            content = `:root {\n${content}\n}`;
            break;
            
        case 'scss':
            content = currentScheme.map(c => `$${c.name.toLowerCase().replace(' ', '-')}: ${c.hex};`).join('\n');
            break;
            
        case 'json':
            content = JSON.stringify(currentScheme.map(c => ({ name: c.name, hex: c.hex })), null, 2);
            break;
    }
    
    downloadFile(content, `scheme.${format}`, format === 'json' ? 'application/json' : 'text/plain');
    showToast(`Scheme exported as ${format.toUpperCase()}!`);
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Previewer
const previewColor = document.getElementById('previewColor');
const previewColorHex = document.getElementById('previewColorHex');
const bgColor = document.getElementById('bgColor');
const bgColorHex = document.getElementById('bgColorHex');
const previewType = document.getElementById('previewType');
const previewWrapper = document.getElementById('previewWrapper');

previewColor.addEventListener('input', () => {
    previewColorHex.textContent = previewColor.value.toUpperCase();
    updatePreview();
});

bgColor.addEventListener('input', () => {
    bgColorHex.textContent = bgColor.value.toUpperCase();
    updatePreview();
});

previewType.addEventListener('change', () => {
    updatePreview();
});

function updatePreview() {
    const primaryColor = previewColor.value;
    const background = bgColor.value;
    const textColor = getContrastColor(background);
    const buttonText = getContrastColor(primaryColor);
    
    previewWrapper.style.background = background;
    
    const title = previewWrapper.querySelector('.preview-title');
    const text = previewWrapper.querySelector('.preview-text');
    const button = previewWrapper.querySelector('.preview-button');
    const card = previewWrapper.querySelector('.preview-card');
    
    title.style.color = primaryColor;
    text.style.color = textColor;
    button.style.background = primaryColor;
    button.style.color = buttonText;
    card.style.background = background === '#ffffff' ? '#f8f9fa' : 'rgba(255,255,255,0.1)';
    card.querySelector('h3').style.color = textColor;
    card.querySelector('p').style.color = textColor;
    
    // Update preview type
    previewWrapper.className = 'preview-wrapper';
    
    switch (previewType.value) {
        case 'mobile':
            previewWrapper.classList.add('mobile-preview');
            break;
        default:
            previewWrapper.classList.add('web-preview');
    }
}

// Contrast Checker
const fgColor = document.getElementById('fgColor');
const fgColorHex = document.getElementById('fgColorHex');
const bgColorContrast = document.getElementById('bgColorContrast');
const bgColorContrastHex = document.getElementById('bgColorContrastHex');
const checkContrastBtn = document.getElementById('checkContrastBtn');

fgColor.addEventListener('input', () => {
    fgColorHex.textContent = fgColor.value.toUpperCase();
});

bgColorContrast.addEventListener('input', () => {
    bgColorContrastHex.textContent = bgColorContrast.value.toUpperCase();
});

checkContrastBtn.addEventListener('click', () => {
    checkContrast();
});

function checkContrast() {
    const foreground = fgColor.value;
    const background = bgColorContrast.value;
    
    const fgLum = getLuminance(foreground);
    const bgLum = getLuminance(background);
    
    const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
    const ratioDisplay = ratio.toFixed(2);
    
    // Update preview
    const previewSamples = document.querySelectorAll('.contrast-sample');
    previewSamples.forEach(sample => {
        sample.style.color = foreground;
        sample.style.background = background;
    });
    
    // Update metrics
    document.getElementById('contrastRatio').textContent = ratioDisplay;
    document.getElementById('aaNormal').textContent = ratio >= 4.5 ? '✓ PASS' : '✗ FAIL';
    document.getElementById('aaNormal').className = 'metric-value ' + (ratio >= 4.5 ? 'pass' : 'fail');
    
    document.getElementById('aaLarge').textContent = ratio >= 3 ? '✓ PASS' : '✗ FAIL';
    document.getElementById('aaLarge').className = 'metric-value ' + (ratio >= 3 ? 'pass' : 'fail');
    
    document.getElementById('aaaNormal').textContent = ratio >= 7 ? '✓ PASS' : '✗ FAIL';
    document.getElementById('aaaNormal').className = 'metric-value ' + (ratio >= 7 ? 'pass' : 'fail');
    
    document.getElementById('aaaLarge').textContent = ratio >= 4.5 ? '✓ PASS' : '✗ FAIL';
    document.getElementById('aaaLarge').className = 'metric-value ' + (ratio >= 4.5 ? 'pass' : 'fail');
    
    showToast('Contrast ratio: ' + ratioDisplay);
}

function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Utility Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text.toUpperCase()}`);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Initialize
updatePreview();
