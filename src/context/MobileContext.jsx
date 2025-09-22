import { createContext, useContext, useEffect, useState } from 'react';

const MobileContext = createContext();

export const MobileProvider = ({ children, breakpoint = 768 }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, [breakpoint]);

    return (
        <MobileContext.Provider value={{ isMobile }}>
            {children}
        </MobileContext.Provider>
    );
};

export const useMobile = () => {
    const context = useContext(MobileContext);
    if (!context) {
        throw new Error('useMobile must be used within MobileProvider');
    }
    return context;
};