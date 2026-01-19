import { useMediaQuery } from './useMediaQuery';

export const useBreakpoint = () => {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    return { isMobile, isTablet };
};
