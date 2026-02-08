"use client";
import React, { createContext, useContext, useState } from "react";

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
    isLocked: boolean;
    setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        // If used outside of SidebarProvider, return a dummy context or handling
        // However, throwing error is safer for ensuring correct usage within Sidebar.
        // For ThemeToggle used in Navigation (outside Sidebar), we need a solution.
        // We can return null and let consumer handle it?
        // But existing consumers expect non-null.
        // So we should maybe return a fallback context if not found?
        // Fallback:
        return {
            open: false,
            setOpen: () => { },
            animate: false,
            isLocked: false,
            setIsLocked: () => { },
        }
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate, isLocked, setIsLocked }}>
            {children}
        </SidebarContext.Provider>
    );
};
