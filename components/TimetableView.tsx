import React, { useState } from 'react';
import type { Class, Teacher, Room, ClassGroup } from '../types';
import { PlusIcon, EditIcon, SaveIcon, CancelIcon, TrashIcon } from './IconComponents';
import ClassFormModal from './EventFormModal';

interface TimetableViewProps {
    classes: Class[];
    teachers: Teacher[];
    rooms: Room[];
    classGroups: ClassGroup[];
    onAddClass: (newClass: Omit<Class, 'id'>) => void;
    onUpdateClass: (updatedClass: Class) => void;
    onDeleteClass: (classId: string) => void;
}

const TimetableView: React.FC<TimetableViewProps> = ({ classes, teachers, rooms, classGroups, onAddClass, onUpdateClass, onDeleteClass }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleAddCustomClassClick = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    const handleEditClassClick = (cls: Class) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
    };

    const handleSaveClass = (classData: Omit<Class, 'id'> | Class) => {
        if ('id' in classData) {
            onUpdateClass(classData);
        } else {
            onAddClass({ ...classData, isCustom: true });
        }
        setIsModalOpen(false);
    };

    const handleDeleteClass = (classId: string) => {
        onDeleteClass(classId);
        setIsModalOpen(false);
    };
    
    const handleToggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };


    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = startOfWeek(currentDate);
        day.setDate(day.getDate() + i);
        return day;
    });

    const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8am to 7pm

    const getClassStyle = (cls: Class) => {
        const startHour = cls.start.getHours();
        const startMinute = cls.start.getMinutes();
        const endHour = cls.end.getHours();
        const endMinute = cls.end.getMinutes();
        
        const top = (startHour - 8) * 60 + startMinute; // minutes from 8am
        const height = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute));

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };
    
    const defaultCategoryColors: { [key: string]: string } = {
        Lecture: 'bg-blue-200 border-blue-500 text-blue-800',
        Lab: 'bg-green-200 border-green-500 text-green-800',
        GroupMeeting: 'bg-purple-200 border-purple-500 text-purple-800',
        Workshop: 'bg-yellow-200 border-yellow-500 text-yellow-800',
        Exam: 'bg-red-200 border-red-500 text-red-800',
        StudySession: 'bg-indigo-200 border-indigo-500 text-indigo-800',
        Appointment: 'bg-pink-200 border-pink-500 text-pink-800',
        Other: 'bg-gray-200 border-gray-500 text-gray-800'
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
            <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">Weekly Timetable</h2>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    {isEditMode ? (
                        <>
                           <button 
                                onClick={handleAddCustomClassClick}
                                className="flex items-center space-x-2 bg-success text-white px-4 py-2 rounded-lg font-semibold hover:bg-success/90 transition shadow">
                                <PlusIcon />
                                <span>Add Custom</span>
                            </button>
                            <button 
                                onClick={handleToggleEditMode}
                                className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition shadow">
                                <CancelIcon />
                                <span>Finish Editing</span>
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleToggleEditMode}
                            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow">
                            <EditIcon />
                            <span>Edit Timetable</span>
                        </button>
                    )}
                </div>
            </header>
            
            <div className="flex-1 overflow-auto mt-4">
                <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[1200px]">
                    {/* Time column */}
                    <div className="relative">
                        {timeSlots.map(time => (
                            <div key={time} className="h-[60px] text-right pr-2 text-sm text-gray-500 -mt-2.5">
                                {time}
                            </div>
                        ))}
                    </div>
                    
                    {/* Day columns */}
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="relative border-l border-gray-100">
                             <div className="sticky top-0 bg-white z-10 text-center py-2 border-b">
                                <p className="font-semibold">{day.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                <p className="text-2xl font-bold">{day.getDate()}</p>
                            </div>
                            <div className="relative h-[720px]">
                                {timeSlots.map(time => (
                                    <div key={time} className="h-[60px] border-t border-gray-100"></div>
                                ))}
                                {classes
                                    .filter(c => c.start.toDateString() === day.toDateString())
                                    .map(cls => (
                                        <div
                                            key={cls.id}
                                            style={getClassStyle(cls)}
                                            onClick={() => handleEditClassClick(cls)}
                                            className={`absolute left-2 right-2 p-2 rounded-lg border-l-4 text-xs cursor-pointer overflow-hidden group ${cls.color || defaultCategoryColors[cls.category]}`}
                                        >
                                            <p className="font-bold truncate">{cls.title}</p>
                                            <p className="truncate">{rooms.find(r=>r.id === cls.roomId)?.name || 'Custom Location'}</p>
                                            
                                            {isEditMode && (cls.isOptional || cls.isCustom) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteClass(cls.id);
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Delete class"
                                                >
                                                    <TrashIcon className="w-3 h-3"/>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <ClassFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveClass}
                    onDelete={handleDeleteClass}
                    classToEdit={selectedClass}
                    teachers={teachers}
                    rooms={rooms}
                    classGroups={classGroups}
                    allClasses={classes}
                />
            )}
        </div>
    );
};

export default TimetableView;