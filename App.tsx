
import React, { useState, useEffect } from 'react';
import type { Page, Class, Teacher, Room, ClassGroup, Conflict, User, Notification } from './types';
import { MOCK_CLASSES, MOCK_TEACHERS, MOCK_ROOMS, MOCK_CLASS_GROUPS } from './constants';
import { detectConflicts } from './services/conflictDetector';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TimetableView from './components/TimetableView';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import BottomNavBar from './components/BottomNavBar';
import ReminderToast from './components/ReminderToast';

const App: React.FC = () => {
    // Auth state
    const [users, setUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem('schedulEaseUsers');
        const initialUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];

        // Ensure the new demo user exists for login
        if (!initialUsers.some(u => u.email === 'demo@schedul.ease')) {
            initialUsers.push({ id: 'user-demo-full', name: 'Demo User', email: 'demo@schedul.ease', password: 'demopass' });
        }
        
        return initialUsers;
    });
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('schedulEaseCurrentUser');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    });

    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [classes, setClasses] = useState<Class[]>(() => {
        const savedClasses = localStorage.getItem(`schedulEaseClasses_${currentUser?.id}`);
        return savedClasses ? JSON.parse(savedClasses, (key, value) => {
            if (key === 'start' || key === 'end') return new Date(value);
            return value;
        }) : []; // Default to an empty array for new users
    });
    const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
    const [rooms] = useState<Room[]>(MOCK_ROOMS);
    const [classGroups] = useState<ClassGroup[]>(MOCK_CLASS_GROUPS);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeReminder, setActiveReminder] = useState<Class | null>(null);
    const [shownReminderIds, setShownReminderIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        localStorage.setItem('schedulEaseUsers', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('schedulEaseCurrentUser', JSON.stringify(currentUser));
            // Load user-specific classes
            const savedClasses = localStorage.getItem(`schedulEaseClasses_${currentUser.id}`);
            
            // For the new demo user, populate schedule on first login or if schedule is empty
            if (currentUser.email === 'demo@schedul.ease' && (!savedClasses || JSON.parse(savedClasses).length === 0)) {
                setClasses(MOCK_CLASSES);
            } else {
                setClasses(savedClasses ? JSON.parse(savedClasses, (key, value) => {
                    if (key === 'start' || key === 'end') return new Date(value);
                    return value;
                }) : []); // Default to empty array if no classes are saved
            }
        } else {
            localStorage.removeItem('schedulEaseCurrentUser');
        }
    }, [currentUser]);
    
    useEffect(() => {
        if(currentUser){
             localStorage.setItem(`schedulEaseClasses_${currentUser.id}`, JSON.stringify(classes));
        }
    }, [classes, currentUser]);


    useEffect(() => {
        const foundConflicts = detectConflicts(classes, teachers, rooms);
        setConflicts(foundConflicts);

        // Generate notifications from conflicts
        const conflictNotifications = foundConflicts
            .filter(c => c.status === 'Unresolved')
            .map(c => ({
                id: `notif-c-${c.id}`,
                message: `Conflict detected: ${c.message}`,
                type: 'conflict',
                read: false,
                timestamp: new Date(),
            } as Notification));
        
        setNotifications(prev => [...prev.filter(n => n.type !== 'conflict'), ...conflictNotifications]);

    }, [classes, teachers, rooms]);

    // Generate notifications and reminders for upcoming classes
    useEffect(() => {
        const checkUpcomingClasses = () => {
            const now = new Date();
            // Find the single next upcoming class within the 15-minute window
            const upcomingClass = classes
                .filter(c => {
                    const diff = c.start.getTime() - now.getTime();
                    return diff > 0 && diff < 15 * 60 * 1000; // 15 minutes
                })
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                [0]; // Get the very next one

            if (upcomingClass && !shownReminderIds.has(upcomingClass.id)) {
                // Set as active reminder toast
                setActiveReminder(upcomingClass);
                
                // Add a notification to the panel
                const newNotification: Notification = {
                    id: `notif-reminder-${upcomingClass.id}`,
                    message: `Reminder: "${upcomingClass.title}" starts at ${upcomingClass.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
                    type: 'class',
                    read: false,
                    timestamp: new Date(),
                };

                setNotifications(prev => {
                    // Avoid duplicates
                    if (prev.some(n => n.id === newNotification.id)) {
                        return prev;
                    }
                    return [...prev, newNotification];
                });

                // Mark this reminder as shown
                setShownReminderIds(prev => new Set(prev).add(upcomingClass.id));
            }
        };

        const interval = setInterval(checkUpcomingClasses, 30 * 1000); // Check every 30 seconds for better responsiveness

        // Reset shown reminders at the start of a new day for recurring classes
        const dailyResetInterval = setInterval(() => {
            setShownReminderIds(new Set());
        }, 24 * 60 * 60 * 1000);


        return () => {
            clearInterval(interval);
            clearInterval(dailyResetInterval);
        };
    }, [classes, shownReminderIds]);
    
    const addClass = (newClass: Omit<Class, 'id'>) => {
        setClasses(prev => [...prev, { ...newClass, id: `cls-${Date.now()}` }]);
    };

    const updateClass = (updatedClass: Class) => {
        setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    };

    const deleteClass = (classId: string) => {
        setClasses(prev => prev.filter(c => c.id !== classId));
    };
    
     const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    };

    const markNotificationAsRead = (notificationId: string) => {
        setNotifications(notifications.map(n => n.id === notificationId ? { ...n, read: true } : n));
    };

    // Auth handlers
    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            setCurrentPage('Dashboard');
            return true;
        }
        return false;
    };

    const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
        if (users.some(u => u.email === email)) {
            return false;
        }
        const newUser: User = { id: `user-${Date.now()}`, name, email, password };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setClasses([]); // Start new user with a blank schedule
        setCurrentPage('Timetable'); // Direct new user to timetable setup
        return true;
    };
    
    const handleDemoLogin = async () => {
        let demoUser = users.find(u => u.email === 'guest@schedul.ease');
        if (!demoUser) {
            demoUser = { id: 'user-demo', name: 'Guest User', email: 'guest@schedul.ease', password: 'password' };
            setUsers(prev => [...prev, demoUser]);
        }
        setCurrentUser(demoUser);
        setClasses(MOCK_CLASSES); // Load the demo schedule
        setCurrentPage('Dashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const renderPage = () => {
        if (!currentUser) return null;
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard currentUser={currentUser} classes={classes} conflicts={conflicts} rooms={rooms} teachers={teachers} classGroups={classGroups} setCurrentPage={setCurrentPage} />;
            case 'Timetable':
                return <TimetableView 
                          classes={classes}
                          teachers={teachers}
                          rooms={rooms}
                          classGroups={classGroups}
                          onAddClass={addClass}
                          onUpdateClass={updateClass}
                          onDeleteClass={deleteClass}
                       />;
            case 'Profile':
                return <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />;
            default:
                return <Dashboard currentUser={currentUser} classes={classes} conflicts={conflicts} rooms={rooms} teachers={teachers} classGroups={classGroups} setCurrentPage={setCurrentPage} />;
        }
    };

    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} onDemoLogin={handleDemoLogin} />;
    }

    return (
        <div className="flex h-screen bg-light-gray font-sans">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray p-4 md:p-8 pb-20 md:pb-8">
                    {renderPage()}
                </main>
            </div>
            <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} className="md:hidden" />
            {activeReminder && (
                <ReminderToast 
                    reminderClass={activeReminder}
                    onDismiss={() => setActiveReminder(null)} 
                />
            )}
        </div>
    );
};

export default App;
