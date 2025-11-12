import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Class, Conflict, Room, Teacher, ClassGroup, Page, User } from '../types';
import { PlusIcon, ConflictIcon } from './IconComponents';

interface DashboardProps {
    currentUser: User;
    classes: Class[];
    conflicts: Conflict[];
    rooms: Room[];
    teachers: Teacher[];
    classGroups: ClassGroup[];
    setCurrentPage: (page: Page) => void;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        {children}
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentUser, classes, conflicts, rooms, setCurrentPage }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysClasses = classes
        .filter(c => c.start >= today && c.start < tomorrow)
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    const unresolvedConflicts = conflicts.filter(c => c.status === 'Unresolved');
    
    const roomUsageData = rooms.map(room => ({
        name: room.name,
        'Hours Used': classes.reduce((acc, c) => {
            if (c.roomId === room.id) {
                return acc + (c.end.getTime() - c.start.getTime()) / (1000 * 60 * 60);
            }
            return acc;
        }, 0)
    }));

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark-gray">Hello, {currentUser.name}!</h1>
                <p className="text-gray-500">Here's what's happening today, {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                 <button onClick={() => setCurrentPage('Timetable')} className="text-left p-6 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition transform hover:-translate-y-1 flex items-center space-x-4">
                    <PlusIcon className="w-8 h-8"/>
                    <div>
                        <h3 className="text-xl font-bold">New Class / Activity</h3>
                        <p className="text-sm">Quickly add a new class or activity to the timetable.</p>
                    </div>
                 </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Your Schedule Today</h2>
                    {todaysClasses.length > 0 ? (
                        <ul className="space-y-4">
                            {todaysClasses.map(c => (
                                <li key={c.id} className="flex items-center space-x-4 p-3 rounded-lg bg-primary/10">
                                    <div className="flex-shrink-0 w-20 text-right font-semibold text-primary">
                                        {formatTime(c.start)}
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <p className="font-bold">{c.title}</p>
                                        <p className="text-sm text-gray-600">{rooms.find(r=>r.id === c.roomId)?.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No classes or activities scheduled for today.</p>
                    )}
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">Resource Usage</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roomUsageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Hours Used" fill="#007BFF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;