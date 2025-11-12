
import React from 'react';
import type { Notification } from '../types';
import { NotificationIcon, ConflictIcon } from './IconComponents';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    unreadCount: number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, onToggle, notifications, onMarkAsRead, unreadCount }) => {
    
    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="relative">
            <button onClick={onToggle} className="relative p-2 rounded-full hover:bg-gray-100 transition text-gray-600">
                <NotificationIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 " onClick={onClose}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-30">
                        <div className="p-4 font-bold border-b">Notifications</div>
                        <ul className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(n => (
                                <li key={n.id} className={`p-4 border-b hover:bg-gray-50 ${!n.read ? 'bg-primary/5' : ''}`} onClick={() => onMarkAsRead(n.id)}>
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 mt-1 ${n.type === 'conflict' ? 'text-warning' : 'text-primary'}`}>
                                            {n.type === 'conflict' ? <ConflictIcon className="w-5 h-5"/> : <NotificationIcon className="w-5 h-5"/>}
                                        </div>
                                        <div>
                                            <p className="text-sm text-dark-gray">{n.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{timeSince(n.timestamp)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))) : (
                                <li className="p-4 text-center text-gray-500">No new notifications.</li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationPanel;
