# Styling Guide

## Overview

This document outlines the styling standards and conventions for the AI VideoHub project. All developers must follow these guidelines to ensure consistency and maintainability.

## Responsive Design

### Breakpoints

The application uses a mobile-first approach with the following breakpoints:

- `sm`: 320px (small mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1400px (extra large desktop)

### Usage

Always start with mobile styles and progressively enhance for larger screens:

```tsx
// ✅ Good - Mobile first
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad - Desktop first
<div className="text-lg md:text-base sm:text-sm">
```

## Typography

### Responsive Typography System

The application includes a responsive typography system with automatic scaling:

- `<h1>`: 2xl → 3xl → 4xl (mobile → tablet → desktop)
- `<h2>`: xl → 2xl → 3xl
- `<h3>`: lg → xl → 2xl
- `<p>`: base → lg

### Font Families

- **Headings**: Use `font-heading` (Satoshi)
- **Body text**: Use `font-sans` (Inter)
- **Code/Monospace**: Use `font-mono` (JetBrains Mono)

## Spacing System

### 8px Grid System

**MANDATORY**: All spacing must use Tailwind's spacing utilities based on the 8px grid:

- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)
- `12` = 3rem (48px)
- `16` = 4rem (64px)

### Usage Rules

```tsx
// ✅ Good - Use spacing utilities
<div className="p-4 m-8 md:p-6">

// ❌ Bad - Arbitrary values
<div className="p-[15px] m-[33px]">

// ✅ Good - Responsive spacing
<div className="px-4 md:px-8 lg:px-12">
```

### Common Spacing Patterns

- **Page containers**: `px-4 sm:px-6 md:px-8 lg:px-12`
- **Card padding**: `p-4 md:p-6`
- **Section spacing**: `space-y-6 md:space-y-8`
- **Button padding**: `px-4 py-2` or `px-6 py-3`

## Container Component

Use the `Container` component for consistent page-level spacing:

```tsx
import { Container } from '@/components/container';

export default function Page() {
  return (
    <Container>
      <h1>Page Title</h1>
      <p>Page content...</p>
    </Container>
  );
}
```

## Theme System

### Color Usage

Always use semantic color tokens:

```tsx
// ✅ Good - Semantic colors
<div className="bg-background text-foreground border-border">

// ❌ Bad - Arbitrary colors
<div className="bg-white text-black border-gray-200">
```

### Theme-Aware Development

Ensure all components work in both light and dark themes by using the semantic color system.

## Best Practices

1. **Mobile-First**: Always start with mobile styles
2. **Semantic Colors**: Use theme-aware color tokens
3. **Grid-Based Spacing**: Stick to the 8px grid system
4. **Consistent Typography**: Use the responsive typography system
5. **Container Usage**: Wrap page content in `Container` component
6. **Accessibility**: Ensure proper contrast and focus states
7. **Testing**: Test all breakpoints and both themes

## Enforcement

These guidelines are enforced through:

- ESLint rules for Tailwind CSS
- Code review requirements
- Automated testing across breakpoints
- Design system documentation

Violations of these standards will be flagged during code review and must be corrected before merge.
