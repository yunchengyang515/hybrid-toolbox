# Customizing Hybrid Toolbox

## Color Palette Customization

The application uses Tailwind CSS with a custom color palette defined in `src/index.css`. You can customize the colors by modifying the CSS variables in the `:root` selector.

### Current Color Scheme

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### How to Customize Colors

1. Open `src/index.css`
2. Locate the `:root` selector
3. Modify the HSL values for any color you want to change

Example modifications:

```css
:root {
  /* Change primary color to purple */
  --primary: 267 83.2% 53.3%;
  
  /* Change accent color to teal */
  --accent: 180 40% 96.1%;
  
  /* Make destructive color more intense */
  --destructive: 0 90% 50%;
}
```

### Color Variables Usage

- `background`: Main background color
- `foreground`: Main text color
- `card`: Card background color
- `card-foreground`: Text color inside cards
- `primary`: Primary action color (buttons, links)
- `secondary`: Secondary UI elements
- `muted`: Subtle UI elements
- `accent`: Highlighted or focused elements
- `destructive`: Error states and dangerous actions
- `border`: Border colors
- `input`: Form input backgrounds
- `ring`: Focus ring color

### Tips for Color Selection

1. Maintain Contrast: Ensure sufficient contrast between background and text colors
2. Consider Accessibility: Use tools like WebAIM's contrast checker
3. Keep it Consistent: Use similar saturation levels for related colors
4. Test in Different Contexts: Preview changes in both light and dark modes

## Adding Custom Themes

You can create additional themes by adding new CSS classes with different color values:

```css
.theme-dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* Add other color overrides */
}

.theme-brand {
  --primary: 250 83.2% 53.3%;
  --accent: 280 40% 96.1%;
  /* Add other color overrides */
}
```

Then apply these themes using CSS classes on your root element.