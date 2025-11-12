
import React, { useEffect } from 'react';
import type { Class } from '../types';
import { CalendarIcon, CancelIcon } from './IconComponents';

interface ReminderToastProps {
    reminderClass: Class;
    onDismiss: () => void;
}

const ReminderToast: React.FC<ReminderToastProps> = ({ reminderClass, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 10000); // Auto-dismiss after 10 seconds

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div 
            className="fixed bottom-8 right-8 w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 z-50 animate-slide-in-up"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-dark-gray">Upcoming Class Reminder</p>
                    <p className="mt-1 text-sm text-gray-700">
                        <span className="font-semibold">{reminderClass.title}</span> is starting soon at <span className="font-semibold">{formatTime(reminderClass.start)}</span>.
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={onDismiss}
                        className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <span className="sr-only">Close</span>
                        <CancelIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderToast;
