
import React, { useState } from 'react';
import { SearchIcon } from './IconComponents';
import type { User, Notification } from '../types';
import NotificationPanel from './NotificationPanel';


interface HeaderProps {
    currentUser: User;
    onLogout: () => void;
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, notifications, onMarkAsRead }) => {
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b z-20">
            <div className="relative w-full max-w-md">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <SearchIcon className="text-gray-400"/>
                 </div>
                 <input
                     type="text"
                     placeholder="Global Search..."
                     className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                 />
            </div>
            <div className="flex items-center space-x-4">
                <NotificationPanel 
                    isOpen={isNotificationPanelOpen} 
                    onClose={() => setIsNotificationPanelOpen(false)}
                    notifications={notifications}
                    onMarkAsRead={onMarkAsRead}
                    unreadCount={unreadCount}
                    onToggle={() => setIsNotificationPanelOpen(prev => !prev)}
                 />
                <div className="relative">
                    {/* User profile dropdown */}
                    <button onClick={onLogout} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition">
                        <img
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="hidden md:flex flex-col items-start">
                            <span className="font-semibold text-sm">{currentUser.name}</span>
                            <span className="text-xs text-gray-500">Student</span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
