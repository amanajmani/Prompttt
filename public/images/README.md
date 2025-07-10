# PROMPTTT Image Assets

## Responsive Image Strategy

This directory contains optimized images for different screen densities and breakpoints.

### Naming Convention

For each UI image, provide multiple density variants:

```
logo.png          # 1x density (standard)
logo@2x.png       # 2x density (high-DPI)
logo@3x.png       # 3x density (ultra-high-DPI)
```

### Directory Structure

```
public/images/
├── logos/
│   ├── logo.png
│   ├── logo@2x.png
│   └── logo@3x.png
├── icons/
│   ├── icon-name.png
│   ├── icon-name@2x.png
│   └── icon-name@3x.png
├── avatars/
│   └── default-avatar.png
└── placeholders/
    └── image-placeholder.png
```

### Recommended Sizes

#### Logos
- **1x**: 48×48px
- **2x**: 96×96px  
- **3x**: 144×144px

#### Icons
- **1x**: 24×24px
- **2x**: 48×48px
- **3x**: 72×72px

#### Avatars
- **1x**: 48×48px
- **2x**: 96×96px
- **3x**: 144×144px

#### Thumbnails
- **1x**: 200×200px
- **2x**: 400×400px
- **3x**: 600×600px

### Optimization Guidelines

1. **Format**: Use WebP for modern browsers, PNG/JPG fallbacks
2. **Quality**: 85-95% for UI elements, 75-85% for content images
3. **Compression**: Optimize all images before deployment
4. **Lazy Loading**: Use for below-the-fold images
5. **Priority Loading**: Use for above-the-fold critical images

### Usage Examples

```tsx
// Logo with responsive densities
<LogoImage
  src="/images/logos/logo.png"
  alt="PROMPTTT Logo"
  densityVariants={{
    '1x': '/images/logos/logo.png',
    '2x': '/images/logos/logo@2x.png',
    '3x': '/images/logos/logo@3x.png'
  }}
/>

// Icon with automatic sizing
<IconImage
  src="/images/icons/theme-toggle.png"
  alt="Theme toggle"
  className="w-6 h-6"
/>

// Avatar with responsive breakpoints
<AvatarImage
  src="/images/avatars/user-avatar.png"
  alt="User avatar"
  breakpoints={{
    mobile: '32px',
    tablet: '40px',
    desktop: '48px'
  }}
/>
```