# Free Color Palette Generator & Extractor

A powerful online tool for designers and developers to extract colors from images and generate beautiful color schemes.

## Features

### 🎨 Color Extractor
- Upload images via drag & drop or click to browse
- Automatically extract the dominant color
- Get top 10 colors from your image
- One-click color copying
- Export palettes in CSS, SCSS, or JSON format

### 🎭 Color Scheme Generator
- Select a base color using the color picker
- Generate multiple scheme types:
  - Complementary
  - Analogous
  - Triadic
  - Tetradic
  - Monochromatic
  - Split Complementary
- Export schemes in CSS, SCSS, or JSON format

### 👁️ Previewer
- Real-time color preview
- Customize foreground and background colors
- Preview modes:
  - Web Page Preview
  - Mobile App Preview
  - Card Component
  - Button Styles
- See how colors look in actual UI components

### ♿ WCAG Contrast Checker
- Check color combinations against WCAG standards
- View contrast ratio
- Test for AA and AAA compliance
- Separate checks for normal and large text
- Visual preview of color combinations

## How to Use

### Extract Colors from Image
1. Go to the "Color Extractor" tab
2. Drag & drop an image or click to upload
3. Click "Extract Colors" button
4. View the dominant color and top 10 colors
5. Click on any color to copy it to clipboard
6. Export your palette in your preferred format

### Generate Color Schemes
1. Go to the "Scheme Generator" tab
2. Choose a base color using the color picker
3. Select the scheme type you want to generate
4. Click "Generate Scheme" button
5. View and interact with the generated colors
6. Export the scheme when satisfied

### Preview Your Colors
1. Go to the "Previewer" tab
2. Select your primary color
3. Choose a background color
4. Select the preview type (web, mobile, card, button)
5. See real-time preview of your color combination

### Check Contrast
1. Go to the "Contrast Checker" tab
2. Select foreground color
3. Select background color
4. Click "Check Contrast" button
5. View the contrast ratio and WCAG compliance status

## Export Formats

### CSS
```css
:root {
  --color-1: #3498db;
  --color-2: #e74c3c;
}
```

### SCSS
```scss
$color-1: #3498db;
$color-2: #e74c3c;
```

### JSON
```json
["#3498db", "#e74c3c"]
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Technical Details

- Pure JavaScript (no dependencies)
- Responsive design
- WCAG 2.1 compliant contrast checking
- Color extraction using Canvas API
- HSL color space for scheme generation
- One-click clipboard copy functionality

## License

Free to use for personal and commercial projects.

## Deployment

This project is ready for deployment to:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Simply upload the `index.html`, `styles.css`, and `app.js` files to your hosting provider.
