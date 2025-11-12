
import React, { useState, useEffect } from 'react';
import type { Class, Teacher, Room, ClassGroup } from '../types';
import { ClassCategory } from '../types';

interface ClassFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (classData: Omit<Class, 'id'> | Class) => void;
    onDelete?: (classId: string) => void;
    classToEdit: Class | null;
    teachers: Teacher[];
    rooms: Room[];
    classGroups: ClassGroup[];
    allClasses: Class[];
}

const colorClasses = [
    'bg-blue-200 border-blue-500 text-blue-800',
    'bg-green-200 border-green-500 text-green-800',
    'bg-purple-200 border-purple-500 text-purple-800',
    'bg-yellow-200 border-yellow-500 text-yellow-800',
    'bg-red-200 border-red-500 text-red-800',
    'bg-indigo-200 border-indigo-500 text-indigo-800',
    'bg-pink-200 border-pink-500 text-pink-800',
    'bg-gray-200 border-gray-500 text-gray-800',
];

const ClassFormModal: React.FC<ClassFormModalProps> = ({
    isOpen, onClose, onSave, onDelete, classToEdit, teachers, rooms, classGroups, allClasses
}) => {
    const isCustomClass = !classToEdit || classToEdit.isCustom;

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ClassCategory>(ClassCategory.Lecture);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [classGroupId, setClassGroupId] = useState('');
    const [color, setColor] = useState(colorClasses[0]);
    const [conflictMessage, setConflictMessage] = useState<string | null>(null);

    useEffect(() => {
        if (classToEdit) {
            setTitle(classToEdit.title);
            setCategory(classToEdit.category);
            const start = classToEdit.start;
            const end = classToEdit.end;
            setStartDate(start.toISOString().split('T')[0]);
            setStartTime(start.toTimeString().substring(0, 5));
            setEndDate(end.toISOString().split('T')[0]);
            setEndTime(end.toTimeString().substring(0, 5));
            setTeacherId(classToEdit.teacherId);
            setRoomId(classToEdit.roomId);
            setClassGroupId(classToEdit.classGroupId);
            setColor(classToEdit.color || colorClasses[0]);
        } else {
           // Reset form
           setTitle('');
           setCategory(ClassCategory.StudySession);
           setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
           setTeacherId(''); setRoomId(''); setClassGroupId('');
           setColor(colorClasses[0]);
        }
    }, [classToEdit]);
    
    useEffect(() => {
        if (!startDate || !startTime || !endDate || !endTime || (!teacherId && !roomId)) {
            setConflictMessage(null);
            return;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        const conflictingClass = allClasses.find(c => {
            if(classToEdit && c.id === classToEdit.id) return false; // Don't check against self
            
            const overlap = start < c.end && end > c.start;
            if(!overlap) return false;
            
            if(teacherId && c.teacherId === teacherId) return true;
            if(roomId && c.roomId === roomId) return true;
            
            return false;
        });

        if (conflictingClass) {
             setConflictMessage(`Conflict detected with "${conflictingClass.title}".`);
        } else {
            setConflictMessage(null);
        }

    }, [startDate, startTime, endDate, endTime, teacherId, roomId, allClasses, classToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        
        const classData = {
            title, category, start, end, teacherId, roomId, classGroupId, color, isCustom: isCustomClass
        };

        if (classToEdit) {
            onSave({ ...classData, id: classToEdit.id, isCustom: classToEdit.isCustom });
        } else {
            onSave({ ...classData, isCustom: true });
        }
    };

    if (!isOpen) return null;

    const customClassCategories = [ClassCategory.StudySession, ClassCategory.Appointment, ClassCategory.Other, ClassCategory.GroupMeeting];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{classToEdit ? 'Edit Class / Activity' : 'Create Custom Activity'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Class/Activity Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={!isCustomClass}/>
                     <SelectField label="Category" value={category} onChange={e => setCategory(e.target.value as ClassCategory)} disabled={!isCustomClass}>
                        {isCustomClass 
                            ? customClassCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                            : Object.values(ClassCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)
                        }
                    </SelectField>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required disabled={!isCustomClass} />
                        <InputField label="Start Time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required disabled={!isCustomClass} />
                        <InputField label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required disabled={!isCustomClass} />
                        <InputField label="End Time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required disabled={!isCustomClass} />
                    </div>
                     <SelectField label="Assign Teacher" value={teacherId} onChange={e => setTeacherId(e.target.value)} required disabled={!isCustomClass}>
                        <option value="">{isCustomClass ? 'No teacher' : 'Select a teacher'}</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </SelectField>
                    <SelectField label="Select Room" value={roomId} onChange={e => setRoomId(e.target.value)} required disabled={!isCustomClass}>
                        <option value="">{isCustomClass ? 'No room' : 'Select a room'}</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </SelectField>
                    <SelectField label="Select Class/Group" value={classGroupId} onChange={e => setClassGroupId(e.target.value)} required disabled={!isCustomClass}>
                         <option value="">{isCustomClass ? 'No class group' : 'Select a class group'}</option>
                        {classGroups.map(cg => <option key={cg.id} value={cg.id}>{cg.name}</option>)}
                    </SelectField>
                    
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colorClasses.map(c => (
                                <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${c.split(' ')[0]} ${c.split(' ')[1]} ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}></button>
                            ))}
                        </div>
                    </div>


                    {conflictMessage && <div className="p-3 bg-warning/20 text-yellow-800 border-l-4 border-warning rounded-r-md">{conflictMessage}</div>}

                    <div className="flex justify-end space-x-4 pt-4">
                        {classToEdit && onDelete && (classToEdit.isCustom || classToEdit.isOptional) && (
                             <button type="button" onClick={() => onDelete(classToEdit.id)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Delete</button>
                        )}
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-primary/50" disabled={!!conflictMessage && isCustomClass}>Save Schedule</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper components for form fields
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100" />
    </div>
);
const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100">
            {children}
        </select>
    </div>
);

export default ClassFormModal;
