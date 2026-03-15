// Comprehensive responsive breakpoints for all device types
export const breakpoints = {
  // Mobile devices
  mobileSmall: 320,    // Small phones (iPhone SE, older Android)
  mobileMedium: 375,   // Standard phones (iPhone 12/13/14)
  mobileLarge: 414,    // Large phones (iPhone Plus, Pro Max)
  
  // Tablets
  tabletSmall: 600,    // Small tablets portrait
  tabletMedium: 768,   // iPad portrait, large tablets
  tabletLarge: 834,    // iPad Pro 11" portrait
  tabletXL: 1024,      // iPad landscape, iPad Pro portrait
  
  // Desktop
  laptopSmall: 1280,   // Small laptops, HD
  laptopMedium: 1366,  // Standard laptops
  desktopSmall: 1440,  // Small desktop monitors
  desktopMedium: 1920, // Full HD (1080p)
  desktopLarge: 2560,  // 2K monitors
  desktop4K: 3840,     // 4K UHD monitors
  desktop5K: 5120,     // 5K monitors (iMac)
  desktop8K: 7680      // 8K monitors
};

// MUI theme breakpoints
export const muiBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 2560,
    xxxl: 3840
  }
};

// Responsive spacing system
export const spacing = {
  mobile: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20
  },
  tablet: {
    xs: 6,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32
  },
  desktop: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }
};

// Responsive typography scale
export const typography = {
  // Mobile typography
  mobile: {
    h1: { fontSize: '1.75rem', lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', lineHeight: 1.4 },
    h4: { fontSize: '1.125rem', lineHeight: 1.4 },
    h5: { fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', lineHeight: 1.6 },
    caption: { fontSize: '0.625rem', lineHeight: 1.4 }
  },
  // Tablet typography
  tablet: {
    h1: { fontSize: '2.5rem', lineHeight: 1.2 },
    h2: { fontSize: '2rem', lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', lineHeight: 1.5 },
    h6: { fontSize: '1.125rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 }
  },
  // Desktop typography
  desktop: {
    h1: { fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontSize: '2.75rem', lineHeight: 1.3 },
    h3: { fontSize: '2.25rem', lineHeight: 1.4 },
    h4: { fontSize: '1.875rem', lineHeight: 1.4 },
    h5: { fontSize: '1.5rem', lineHeight: 1.5 },
    h6: { fontSize: '1.25rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', lineHeight: 1.7 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5 }
  },
  // 4K typography
  desktop4K: {
    h1: { fontSize: '5rem', lineHeight: 1.1 },
    h2: { fontSize: '4rem', lineHeight: 1.2 },
    h3: { fontSize: '3rem', lineHeight: 1.3 },
    h4: { fontSize: '2.5rem', lineHeight: 1.4 },
    h5: { fontSize: '2rem', lineHeight: 1.5 },
    h6: { fontSize: '1.75rem', lineHeight: 1.5 },
    body1: { fontSize: '1.25rem', lineHeight: 1.7 },
    body2: { fontSize: '1.125rem', lineHeight: 1.7 },
    caption: { fontSize: '1rem', lineHeight: 1.5 }
  }
};

// Container max widths for different screens
export const containerWidths = {
  mobile: '100%',
  tablet: '100%',
  laptop: '1200px',
  desktop: '1440px',
  desktop2K: '1920px',
  desktop4K: '2560px',
  desktop8K: '3840px'
};

// Grid configurations for different screens
export const gridConfig = {
  mobile: {
    columns: 4,
    gutter: 16,
    margin: 16
  },
  tablet: {
    columns: 8,
    gutter: 24,
    margin: 24
  },
  desktop: {
    columns: 12,
    gutter: 32,
    margin: 32
  },
  desktop4K: {
    columns: 12,
    gutter: 48,
    margin: 64
  }
};

// Component-specific responsive styles
export const componentStyles = {
  card: {
    mobile: {
      padding: '12px',
      borderRadius: '8px',
      minHeight: '120px'
    },
    tablet: {
      padding: '16px',
      borderRadius: '12px',
      minHeight: '150px'
    },
    desktop: {
      padding: '24px',
      borderRadius: '16px',
      minHeight: '180px'
    },
    desktop4K: {
      padding: '32px',
      borderRadius: '20px',
      minHeight: '240px'
    }
  },
  button: {
    mobile: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      minHeight: '36px'
    },
    tablet: {
      padding: '10px 20px',
      fontSize: '1rem',
      minHeight: '42px'
    },
    desktop: {
      padding: '12px 24px',
      fontSize: '1rem',
      minHeight: '48px'
    },
    desktop4K: {
      padding: '16px 32px',
      fontSize: '1.25rem',
      minHeight: '64px'
    }
  },
  input: {
    mobile: {
      height: '40px',
      fontSize: '14px'
    },
    tablet: {
      height: '48px',
      fontSize: '16px'
    },
    desktop: {
      height: '56px',
      fontSize: '16px'
    },
    desktop4K: {
      height: '72px',
      fontSize: '20px'
    }
  }
};

// Responsive image sizes
export const imageSizes = {
  thumbnail: {
    mobile: { width: 80, height: 80 },
    tablet: { width: 120, height: 120 },
    desktop: { width: 150, height: 150 },
    desktop4K: { width: 200, height: 200 }
  },
  card: {
    mobile: { width: '100%', height: 200 },
    tablet: { width: '100%', height: 250 },
    desktop: { width: '100%', height: 300 },
    desktop4K: { width: '100%', height: 400 }
  },
  hero: {
    mobile: { width: '100%', height: 300 },
    tablet: { width: '100%', height: 400 },
    desktop: { width: '100%', height: 600 },
    desktop4K: { width: '100%', height: 800 }
  }
};

// Helper function to get current breakpoint
export const getCurrentBreakpoint = (width) => {
  if (width < breakpoints.mobileSmall) return 'mobileSmall';
  if (width < breakpoints.mobileMedium) return 'mobileMedium';
  if (width < breakpoints.mobileLarge) return 'mobileLarge';
  if (width < breakpoints.tabletSmall) return 'tabletSmall';
  if (width < breakpoints.tabletMedium) return 'tabletMedium';
  if (width < breakpoints.tabletLarge) return 'tabletLarge';
  if (width < breakpoints.tabletXL) return 'tabletXL';
  if (width < breakpoints.laptopSmall) return 'laptopSmall';
  if (width < breakpoints.laptopMedium) return 'laptopMedium';
  if (width < breakpoints.desktopSmall) return 'desktopSmall';
  if (width < breakpoints.desktopMedium) return 'desktopMedium';
  if (width < breakpoints.desktopLarge) return 'desktopLarge';
  if (width < breakpoints.desktop4K) return 'desktop4K';
  if (width < breakpoints.desktop5K) return 'desktop5K';
  if (width < breakpoints.desktop8K) return 'desktop8K';
  return 'desktop8K';
};

// Media query helpers
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tabletSmall - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.tabletSmall}px) and (max-width: ${breakpoints.tabletXL - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.tabletXL}px)`,
  desktop2K: `@media (min-width: ${breakpoints.desktopLarge}px)`,
  desktop4K: `@media (min-width: ${breakpoints.desktop4K}px)`,
  desktop8K: `@media (min-width: ${breakpoints.desktop8K}px)`,
  
  // Specific device queries
  iPhoneSE: `@media (max-width: 375px) and (max-height: 667px)`,
  iPhone12: `@media (max-width: 390px) and (max-height: 844px)`,
  iPhonePlus: `@media (max-width: 414px) and (max-height: 896px)`,
  iPad: `@media (min-width: 768px) and (max-width: 1024px)`,
  iPadPro11: `@media (min-width: 834px) and (max-width: 1194px)`,
  iPadPro12: `@media (min-width: 1024px) and (max-width: 1366px)`,
  
  // Orientation queries
  portrait: `@media (orientation: portrait)`,
  landscape: `@media (orientation: landscape)`,
  
  // High DPI screens
  retina: `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)`,
  retina3x: `@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)`
};

export default {
  breakpoints,
  muiBreakpoints,
  spacing,
  typography,
  containerWidths,
  gridConfig,
  componentStyles,
  imageSizes,
  getCurrentBreakpoint,
  mediaQueries
};