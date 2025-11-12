
import React, { useState } from 'react';
import type { User } from '../types';

interface ProfilePageProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        {children}
    </div>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        const updatedUser = {
            ...user,
            name,
            ...(password && { password: password }), // Only update password if a new one is provided
        };
        onUpdateUser(updatedUser);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setPassword('');
        setConfirmPassword('');
    };


    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dark-gray">Your Profile</h1>
                <p className="text-gray-500">Manage your personal information and account settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                    <Card className="w-full text-center">
                         <img
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}&radius=50&size=128`}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary"
                        />
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <h3 className="text-xl font-bold border-b pb-2">Edit Information</h3>
                            <InputField 
                                label="Full Name" 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                            />
                            <InputField 
                                label="Email Address" 
                                type="email" 
                                value={user.email} 
                                disabled 
                                className="bg-gray-100"
                            />
                             <h3 className="text-xl font-bold border-b pb-2 pt-4">Change Password</h3>
                             <p className="text-sm text-gray-500 -mt-4">Leave blank to keep your current password.</p>
                             <InputField 
                                label="New Password" 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputField 
                                label="Confirm New Password" 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />

                            {message && (
                                <p className={`text-sm p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </p>
                            )}

                            <div className="text-right">
                                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
