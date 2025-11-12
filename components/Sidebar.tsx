
import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, CalendarIcon, ProfileIcon } from './IconComponents';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    // FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve issue with JSX namespace not being found.
    const navItems: { name: Page; icon: React.ReactElement }[] = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Timetable', icon: <CalendarIcon /> },
        { name: 'Profile', icon: <ProfileIcon /> },
    ];

    return (
        <nav className="bg-white w-20 lg:w-64 shadow-lg transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-center lg:justify-start lg:pl-6 h-20 border-b">
                <span className="text-primary font-bold text-2xl">S</span>
                <span className="hidden lg:inline text-primary font-bold text-2xl">chedul</span>
                <span className="hidden lg:inline text-success font-bold text-2xl">Ease</span>
            </div>
            <ul className="flex-1 px-2 lg:px-4 py-4">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(item.name);
                            }}
                            className={`flex items-center justify-center lg:justify-start space-x-3 p-3 my-2 rounded-lg font-medium transition-colors ${
                                currentPage === item.name
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            <span className="w-6 h-6">{item.icon}</span>
                            <span className="hidden lg:inline">{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;
