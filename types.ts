
export type Page = 'Dashboard' | 'Timetable' | 'Profile' | 'Reports' | 'Settings';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app this would be a hash
}

export enum ClassCategory {
    Lecture = 'Lecture',
    Lab = 'Lab',
    GroupMeeting = 'Group Meeting',
    Workshop = 'Workshop',
    Exam = 'Exam',
    StudySession = 'Study Session',
    Appointment = 'Appointment',
    Other = 'Other'
}

export interface Class {
    id: string;
    title: string;
    description?: string;
    category: ClassCategory;
    start: Date;
    end: Date;
    teacherId: string;
    roomId: string;
    classGroupId: string;
    color?: string; // e.g., '#FFC107'
    isOptional?: boolean;
    isCustom?: boolean; // Student-added class
}

export interface Teacher {
    id: string;
    name: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
    type: 'Lab' | 'Lecture Hall' | 'Meeting Room';
}

export interface ClassGroup {
    id: string;
    name: string;
}

export interface Conflict {
    id: string;
    type: 'Teacher Conflict' | 'Room Conflict';
    message: string;
    classIds: [string, string];
    resourceId: string;
    status: 'Unresolved' | 'Resolved';
}

export interface Notification {
    id: string;
    message: string;
    type: 'class' | 'conflict' | 'general';
    read: boolean;
    timestamp: Date;
}
