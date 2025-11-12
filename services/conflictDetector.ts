
import type { Class, Conflict, Teacher, Room } from '../types';

export const detectConflicts = (classes: Class[], teachers: Teacher[], rooms: Room[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    const sortedClasses = [...classes].sort((a, b) => a.start.getTime() - b.start.getTime());

    for (let i = 0; i < sortedClasses.length; i++) {
        for (let j = i + 1; j < sortedClasses.length; j++) {
            const classA = sortedClasses[i];
            const classB = sortedClasses[j];

            // Check for time overlap
            const overlap = classA.start < classB.end && classA.end > classB.start;
            if (!overlap) continue;

            // Check for teacher conflict
            if (classA.teacherId === classB.teacherId) {
                const teacher = teachers.find(t => t.id === classA.teacherId);
                conflicts.push({
                    id: `c-${classA.id}-${classB.id}-t`,
                    type: 'Teacher Conflict',
                    message: `${teacher?.name || 'A teacher'} is double-booked for "${classA.title}" and "${classB.title}".`,
                    classIds: [classA.id, classB.id],
                    resourceId: classA.teacherId,
                    status: 'Unresolved',
                });
            }

            // Check for room conflict
            if (classA.roomId === classB.roomId) {
                const room = rooms.find(r => r.id === classA.roomId);
                conflicts.push({
                    id: `c-${classA.id}-${classB.id}-r`,
                    type: 'Room Conflict',
                    message: `${room?.name || 'A room'} is double-booked for "${classA.title}" and "${classB.title}".`,
                    classIds: [classA.id, classB.id],
                    resourceId: classA.roomId,
                    status: 'Unresolved',
                });
            }
        }
    }

    return conflicts;
};
