import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, CalendarIcon, ProfileIcon } from './IconComponents';

interface BottomNavBarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    className?: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage, className }) => {
    // FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve issue with JSX namespace not being found.
    const navItems: { name: Page; icon: React.ReactElement }[] = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Timetable', icon: <CalendarIcon /> },
        { name: 'Profile', icon: <ProfileIcon /> },
    ];

    return (
        <nav className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-50 ${className}`}>
            <ul className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <li key={item.name} className="flex-1">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(item.name);
                            }}
                            className={`flex flex-col items-center justify-center space-y-1 w-full h-full font-medium transition-colors text-sm ${
                                currentPage === item.name
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-primary'
                            }`}
                        >
                            <span className="w-6 h-6">{item.icon}</span>
                            <span>{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomNavBar;
