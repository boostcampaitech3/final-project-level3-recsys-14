import React from "react"
import { useMediaQuery } from "react-responsive"

export const Phone = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isPhone = useMediaQuery({ 
        maxWidth: 480
    });
    return isPhone ? children : null;
};

export const Tablet = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isTablet = useMediaQuery({ 
        minWidth: 480,
        maxWidth: 800,
    });
    return isTablet ? children : null;
};

export const NarrowPC = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isNarrowPC = useMediaQuery({ 
        minWidth: 800,
        maxWidth: 1024,
    });
    return isNarrowPC ? children : null;
};

export const WidePC = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isWidePC = useMediaQuery({ 
        minWidth: 1024
    });
    return isWidePC ? children : null;
};
   
export const Mobile = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isMobile = useMediaQuery({ 
        maxWidth: 800
    });
    return isMobile ? children : null;
};

export const Desktop = ({children}: {children: JSX.Element}): JSX.Element | null => {
    const isDesktop = useMediaQuery({ 
        minWidth: 800
    });
    return isDesktop ? children : null;
};