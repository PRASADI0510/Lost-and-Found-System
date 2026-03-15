import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom hook for responsive design
export const useResponsive = () => {
  const theme = useTheme();
  const [screenSize, setScreenSize] = useState('desktop');
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  // Media queries for all screen sizes
  const isMobileSmall = useMediaQuery('(max-width:320px)');
  const isMobileMedium = useMediaQuery('(max-width:375px)');
  const isMobileLarge = useMediaQuery('(max-width:414px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isTabletSmall = useMediaQuery('(min-width:600px) and (max-width:768px)');
  const isTabletMedium = useMediaQuery('(min-width:768px) and (max-width:834px)');
  const isTabletLarge = useMediaQuery('(min-width:834px) and (max-width:1024px)');
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const isLaptopSmall = useMediaQuery('(min-width:1024px) and (max-width:1280px)');
  const isLaptopMedium = useMediaQuery('(min-width:1280px) and (max-width:1366px)');
  const isDesktopSmall = useMediaQuery('(min-width:1366px) and (max-width:1440px)');
  const isDesktopMedium = useMediaQuery('(min-width:1440px) and (max-width:1920px)');
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const isDesktop2K = useMediaQuery('(min-width:2560px)');
  const isDesktop4K = useMediaQuery('(min-width:3840px)');
  const isDesktop5K = useMediaQuery('(min-width:5120px)');
  const isDesktop8K = useMediaQuery('(min-width:7680px)');

  // Device-specific queries
  const isIPhoneSE = useMediaQuery('(max-width:375px) and (max-height:667px)');
  const isIPhone12 = useMediaQuery('(max-width:390px) and (max-height:844px)');
  const isIPhonePlus = useMediaQuery('(max-width:414px) and (max-height:896px)');
  const isIPad = useMediaQuery('(min-width:768px) and (max-width:1024px)');
  const isIPadPro11 = useMediaQuery('(min-width:834px) and (max-width:1194px)');
  const isIPadPro12 = useMediaQuery('(min-width:1024px) and (max-width:1366px)');

  // Orientation queries
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  // High DPI screens
  const isRetina = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');
  const isRetina3x = useMediaQuery('(-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Determine screen size category
      if (width < 600) {
        setScreenSize('mobile');
      } else if (width < 900) {
        setScreenSize('tablet');
      } else if (width < 1200) {
        setScreenSize('laptop');
      } else if (width < 1920) {
        setScreenSize('desktop');
      } else if (width < 2560) {
        setScreenSize('desktopHD');
      } else if (width < 3840) {
        setScreenSize('desktop2K');
      } else if (width < 5120) {
        setScreenSize('desktop4K');
      } else if (width < 7680) {
        setScreenSize('desktop5K');
      } else {
        setScreenSize('desktop8K');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive values
  const getResponsiveValue = (mobileValue, tabletValue, desktopValue, desktop4KValue) => {
    if (isDesktop4K && desktop4KValue !== undefined) return desktop4KValue;
    if (isDesktop && desktopValue !== undefined) return desktopValue;
    if (isTablet && tabletValue !== undefined) return tabletValue;
    return mobileValue;
  };

  const getResponsiveFontSize = (baseSize) => {
    const multiplier = isDesktop8K ? 2.5 :
                      isDesktop4K ? 1.5 :
                      isDesktop2K ? 1.25 :
                      isDesktop ? 1 :
                      isTablet ? 0.9 :
                      0.8;
    return `${baseSize * multiplier}rem`;
  };

  const getResponsivePadding = (basePadding) => {
    const multiplier = isDesktop8K ? 3 :
                      isDesktop4K ? 2 :
                      isDesktop2K ? 1.5 :
                      isDesktop ? 1 :
                      isTablet ? 0.75 :
                      0.5;
    return basePadding * multiplier;
  };

  const getResponsiveSpacing = (baseSpacing) => {
    const multiplier = isDesktop8K ? 2.5 :
                      isDesktop4K ? 1.75 :
                      isDesktop2K ? 1.5 :
                      isDesktop ? 1 :
                      isTablet ? 0.875 :
                      0.75;
    return baseSpacing * multiplier;
  };

  const getContainerMaxWidth = () => {
    if (isDesktop8K) return '3840px';
    if (isDesktop5K) return '3200px';
    if (isDesktop4K) return '2560px';
    if (isDesktop2K) return '2048px';
    if (isDesktopMedium) return '1440px';
    if (isDesktop) return '1200px';
    if (isTablet) return '100%';
    return '100%';
  };

  const getGridColumns = () => {
    if (isDesktop4K) return 12;
    if (isDesktop) return 12;
    if (isTablet) return 8;
    return 4;
  };

  const getImageSize = (type = 'card') => {
    const sizes = {
      thumbnail: {
        mobile: { width: 80, height: 80 },
        tablet: { width: 120, height: 120 },
        desktop: { width: 150, height: 150 },
        desktop4K: { width: 200, height: 200 },
        desktop8K: { width: 300, height: 300 }
      },
      card: {
        mobile: { width: '100%', height: 200 },
        tablet: { width: '100%', height: 250 },
        desktop: { width: '100%', height: 300 },
        desktop4K: { width: '100%', height: 400 },
        desktop8K: { width: '100%', height: 600 }
      },
      hero: {
        mobile: { width: '100%', height: 300 },
        tablet: { width: '100%', height: 400 },
        desktop: { width: '100%', height: 600 },
        desktop4K: { width: '100%', height: 800 },
        desktop8K: { width: '100%', height: 1200 }
      }
    };

    const sizeCategory = isDesktop8K ? 'desktop8K' :
                        isDesktop4K ? 'desktop4K' :
                        isDesktop ? 'desktop' :
                        isTablet ? 'tablet' :
                        'mobile';

    return sizes[type][sizeCategory];
  };

  return {
    // Screen size categories
    screenSize,
    dimensions,
    
    // Boolean checks
    isMobile,
    isMobileSmall,
    isMobileMedium,
    isMobileLarge,
    isTablet,
    isTabletSmall,
    isTabletMedium,
    isTabletLarge,
    isLaptopSmall,
    isLaptopMedium,
    isDesktop,
    isDesktopSmall,
    isDesktopMedium,
    isDesktop2K,
    isDesktop4K,
    isDesktop5K,
    isDesktop8K,
    
    // Device-specific
    isIPhoneSE,
    isIPhone12,
    isIPhonePlus,
    isIPad,
    isIPadPro11,
    isIPadPro12,
    
    // Orientation
    isPortrait,
    isLandscape,
    
    // Display quality
    isRetina,
    isRetina3x,
    
    // Helper functions
    getResponsiveValue,
    getResponsiveFontSize,
    getResponsivePadding,
    getResponsiveSpacing,
    getContainerMaxWidth,
    getGridColumns,
    getImageSize
  };
};

export default useResponsive;