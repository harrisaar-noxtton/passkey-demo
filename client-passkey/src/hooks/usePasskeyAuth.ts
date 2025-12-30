import { useState } from 'react';
import toast from 'react-hot-toast';
import { passkeyService } from '../services/passkeyService';

export const usePasskeyAuth = () => {
    const [username, setUsername] = useState('user@example.com');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleRegister = async () => {
        try {
            setStatusMessage('Starting registration...');
            console.log(`[UI] Registering with passkey for: ${username}`);

            await passkeyService.register(username);

            setStatusMessage('Registration successful!');
            toast.success('Passkey registered successfully!');
            console.log('[UI] Registration flow completed successfully');
            return true;
        } catch (error: any) {
            console.error('[UI] Registration error:', error);
            setStatusMessage(`Error: ${error.message}`);
            toast.error(error.message || 'Registration failed');
            return false;
        }
    };

    const handleLogin = async () => {
        try {
            setStatusMessage('Starting login...');
            console.log(`[UI] Logging in with passkey for: ${username}`);

            await passkeyService.login(username);

            setIsLoggedIn(true);
            setStatusMessage('Login successful!');
            toast.success('Logged in successfully!');
            console.log('[UI] Login flow completed successfully');
            return true;
        } catch (error: any) {
            console.error('[UI] Login error:', error);
            setStatusMessage(`Error: ${error.message}`);
            toast.error(error.message || 'Login failed');
            return false;
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setStatusMessage('Logged out');
        console.log('[UI] User logged out');
        toast.success('Logged out');
    };

    return {
        username,
        setUsername,
        isLoggedIn,
        statusMessage,
        handleRegister,
        handleLogin,
        handleLogout
    };
};
