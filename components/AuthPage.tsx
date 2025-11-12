import React, { useState } from 'react';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onRegister: (name: string, email: string, password: string) => Promise<boolean>;
    onDemoLogin: () => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onDemoLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        let success = false;
        try {
            if (isLoginView) {
                success = await onLogin(email, password);
                if (!success) {
                    setError('Invalid email or password.');
                }
            } else {
                success = await onRegister(name, email, password);
                if (!success) {
                    setError('An account with this email already exists.');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
        setIsLoading(false);
    };
    
    const handleDemo = async () => {
        setIsLoading(true);
        try {
            await onDemoLogin();
        } catch (err) {
             setError('Could not start demo session. Please try again.');
        }
        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-gray font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-dark-gray">
                        <span className="text-primary">Schedul</span>
                        <span className="text-success">Ease</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {isLoginView ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLoginView && (
                         <InputField label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                    )}
                    <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
                    <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete={isLoginView ? "current-password" : "new-password"}/>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50 transition-all">
                            {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>
                </form>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative px-2 bg-white text-sm text-gray-500">Or</div>
                </div>

                <div>
                    <button onClick={handleDemo} disabled={isLoading} className="w-full px-4 py-2 font-semibold text-dark-gray bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-200/50 transition-all">
                        Continue as Guest
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-primary hover:underline">
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>

                {isLoginView && (
                    <div className="text-center text-sm text-gray-500 pt-4 border-t mt-4">
                        <p className="font-semibold">Try the demo account with a saved schedule:</p>
                        <p>Email: <span className="font-mono text-primary">demo@schedul.ease</span></p>
                        <p>Password: <span className="font-mono text-primary">demopass</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition" />
    </div>
);

export default AuthPage;