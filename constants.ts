import { ClassCategory, type Teacher, type Room, type ClassGroup, type Class } from './types';

export const MOCK_TEACHERS: Teacher[] = [
    { id: 't1', name: 'Dr. Alan Turing' },
    { id: 't2', name: 'Dr. Ada Lovelace' },
    { id: 't3', name: 'Dr. Grace Hopper' },
];

export const MOCK_ROOMS: Room[] = [
    { id: 'r1', name: 'Room 101', capacity: 50, type: 'Lecture Hall' },
    { id: 'r2', name: 'Lab A', capacity: 25, type: 'Lab' },
    { id: 'r3', name: 'Room 102', capacity: 50, type: 'Lecture Hall' },
    { id: 'r4', name: 'Meeting Room B', capacity: 15, type: 'Meeting Room' },
];

export const MOCK_CLASS_GROUPS: ClassGroup[] = [
    { id: 'cg1', name: 'Computer Science 101' },
    { id: 'cg2', name: 'Advanced Algorithms' },
    { id: 'cg3', name: 'Web Development' },
];

const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setHours(0, 0, 0, 0);
    return new Date(d.setDate(diff));
};

const startOfWeek = getStartOfWeek(new Date());

const getDayOfWeek = (dayIndex: number, hour: number, minute: number = 0): Date => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    date.setHours(hour, minute, 0, 0);
    return date;
};

const weeklyScheduleTemplate = [
    // Monday
    { day: 0, time: 8, title: 'Intro to Algorithms', category: ClassCategory.Lecture, teacherId: 't1', roomId: 'r1', classGroupId: 'cg1', color: 'bg-blue-200 border-blue-500 text-blue-800' },
    { day: 0, time: 10, title: 'Data Structures Lab', category: ClassCategory.Lab, teacherId: 't2', roomId: 'r2', classGroupId: 'cg2', color: 'bg-green-200 border-green-500 text-green-800' },
    { day: 0, time: 12, title: 'Web Dev Basics', category: ClassCategory.Workshop, teacherId: 't3', roomId: 'r3', classGroupId: 'cg3', color: 'bg-yellow-200 border-yellow-500 text-yellow-800' },
    // Tuesday
    { day: 1, time: 8, title: 'Advanced Algorithms', category: ClassCategory.Lecture, teacherId: 't2', roomId: 'r3', classGroupId: 'cg2', color: 'bg-blue-200 border-blue-500 text-blue-800' },
    { day: 1, time: 10, title: 'Group Project Meeting', category: ClassCategory.GroupMeeting, teacherId: 't1', roomId: 'r4', classGroupId: 'cg1', color: 'bg-purple-200 border-purple-500 text-purple-800', isOptional: true },
    { day: 1, time: 12, title: 'Computer Graphics', category: ClassCategory.Lecture, teacherId: 't3', roomId: 'r1', classGroupId: 'cg3', color: 'bg-pink-200 border-pink-500 text-pink-800' },
    // Wednesday
    { day: 2, time: 8, title: 'Intro to Algorithms', category: ClassCategory.Lecture, teacherId: 't1', roomId: 'r1', classGroupId: 'cg1', color: 'bg-blue-200 border-blue-500 text-blue-800' },
    { day: 2, time: 10, title: 'AI Ethics Seminar', category: ClassCategory.Workshop, teacherId: 't1', roomId: 'r3', classGroupId: 'cg2', color: 'bg-red-200 border-red-500 text-red-800' },
    { day: 2, time: 12, title: 'Data Structures Lab', category: ClassCategory.Lab, teacherId: 't2', roomId: 'r2', classGroupId: 'cg2', color: 'bg-green-200 border-green-500 text-green-800' },
    // Thursday
    { day: 3, time: 8, title: 'Web Dev Workshop', category: ClassCategory.Workshop, teacherId: 't3', roomId: 'r3', classGroupId: 'cg3', color: 'bg-yellow-200 border-yellow-500 text-yellow-800' },
    { day: 3, time: 10, title: 'Advanced Algorithms', category: ClassCategory.Lecture, teacherId: 't2', roomId: 'r3', classGroupId: 'cg2', color: 'bg-blue-200 border-blue-500 text-blue-800' },
    { day: 3, time: 12, title: 'Robotics Club Meeting', category: ClassCategory.GroupMeeting, teacherId: 't3', roomId: 'r2', classGroupId: 'cg3', color: 'bg-indigo-200 border-indigo-500 text-indigo-800', isOptional: true },
    // Friday
    { day: 4, time: 8, title: 'Operating Systems', category: ClassCategory.Lecture, teacherId: 't1', roomId: 'r1', classGroupId: 'cg1', color: 'bg-blue-200 border-blue-500 text-blue-800' },
    { day: 4, time: 10, title: 'Cybersecurity Basics', category: ClassCategory.Lecture, teacherId: 't2', roomId: 'r3', classGroupId: 'cg2', color: 'bg-red-200 border-red-500 text-red-800' },
    { day: 4, time: 12, title: 'Final Project Work Session', category: ClassCategory.StudySession, teacherId: 't3', roomId: 'r4', classGroupId: 'cg3', color: 'bg-purple-200 border-purple-500 text-purple-800', isOptional: true },
];

export const MOCK_CLASSES: Class[] = weeklyScheduleTemplate.map((item, index) => {
    const start = getDayOfWeek(item.day, item.time);
    const end = new Date(start);
    end.setHours(start.getHours() + 2);

    return {
        id: `cls-${index + 1}`,
        title: item.title,
        category: item.category,
        start,
        end,
        teacherId: item.teacherId,
        roomId: item.roomId,
        classGroupId: item.classGroupId,
        color: item.color,
        isOptional: item.isOptional || false,
    };
});