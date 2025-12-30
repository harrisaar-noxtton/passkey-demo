import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const BASE_URL = '/passkey';

export const passkeyService = {
    /**
     * Register a new Passkey
     */
    async register(username: string) {
        // 1. Get registration options from server
        console.log(`[UI] Registering with passkey for: ${username}`);
        const startResp = await fetch(`${BASE_URL}/register-start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        if (!startResp.ok) {
            let errorMessage = 'Failed to get registration options';
            try {
                const errorData = await startResp.json();
                errorMessage = errorData.error || errorMessage;
            } catch {
                errorMessage = await startResp.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const options = await startResp.json();
        console.log('[PasskeyService] Registration Options Received:', options);

        if (!options.challenge) {
            throw new Error('Registration options missing challenge');
        }

        // 2. Pass options to browser authenticator
        let attResp;
        try {
            console.log('[PasskeyService] Starting Browser Registration...');
            // In v13, we pass the options object directly
            attResp = await startRegistration(options);
            console.log('[PasskeyService] Registration Response from Browser:', JSON.stringify(attResp, null, 2));
        } catch (error: any) {
            console.error('[PasskeyService] Registration Error:', error);
            // Check for specific error types
            if (error.name === 'InvalidStateError') {
                throw new Error('This device is already registered or the passkey already exists.');
            }
            throw error;
        }

        // 3. Send authenticator response to server for verification
        console.log('[PasskeyService] Sending verification to server...');
        const verificationResp = await fetch(`${BASE_URL}/register-finish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                data: attResp,
            }),
        });

        const verificationJSON = await verificationResp.json();
        console.log('[PasskeyService] Verification Result:', verificationJSON);

        if (verificationJSON.verified) {
            console.log('[PasskeyService] Registration Successful!');
            return true;
        } else {
            throw new Error(verificationJSON.error || 'Verification failed');
        }
    },

    /**
     * Authenticate (Login) with a Passkey
     */
    async login(username: string) {
        // 1. Get authentication options from server
        console.log(`[UI] Logging in with passkey for: ${username}`);
        const startResp = await fetch(`${BASE_URL}/login-start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        if (!startResp.ok) {
            let errorMessage = 'Failed to get authentication options';
            try {
                const errorData = await startResp.json();
                errorMessage = errorData.error || errorMessage;
            } catch {
                errorMessage = await startResp.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const options = await startResp.json();
        console.log('[PasskeyService] Authentication Options Received:', options);

        if (!options.challenge) {
            throw new Error('Authentication options missing challenge');
        }

        // 2. Pass options to browser authenticator
        let asseResp;
        try {
            console.log('[PasskeyService] Starting Browser Authentication...');
            // In v13, we pass the options object directly
            asseResp = await startAuthentication(options);
            console.log('[PasskeyService] Authentication Response from Browser:', JSON.stringify(asseResp, null, 2));
        } catch (error: any) {
            console.error('[PasskeyService] Authentication Error:', error);
            if (error.name === 'NotAllowedError') {
                throw new Error('Authentication was cancelled or the device timed out.');
            }
            throw error;
        }

        // 3. Send authenticator response to server for verification
        console.log('[PasskeyService] Sending verification to server...');
        const verificationResp = await fetch(`${BASE_URL}/login-finish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                data: asseResp,
            }),
        });

        const verificationJSON = await verificationResp.json();
        console.log('[PasskeyService] Verification Result:', verificationJSON);

        if (verificationJSON.verified) {
            console.log('[PasskeyService] Login Successful!');
            return true;
        } else {
            throw new Error(verificationJSON.error || 'Verification failed');
        }
    },
};
