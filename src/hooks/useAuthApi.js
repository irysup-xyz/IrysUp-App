import { useCallback } from 'react';
import crypto from 'crypto-js';

const useAuthApi = () => {
    const generateSalt = useCallback(() => {
        return crypto.lib.WordArray.random(32).toString(crypto.enc.Hex);
    }, []);

    const hashPassword = useCallback((password, salt, username) => {
        const combined = password + salt + username;
        const hash = crypto.SHA256(combined).toString(crypto.enc.Hex);
        return { combined, hash };
    }, []);

    const registerHash = useCallback((username, password) => {
        if (!username || !password) {
            throw new Error('Username and password required.');
        }
        const salt = generateSalt();
        const { combined, hash } = hashPassword(password, salt, username);
        return {
            username,
            salt,
            passwordHash: hash,
            combined
        };
    }, [generateSalt, hashPassword]);

    const loginHash = useCallback((username, password, saltFromApi) => {
        if (!username || !password || !saltFromApi) {
            throw new Error('All fields required, including salt from API.');
        }
        const { combined, hash } = hashPassword(password, saltFromApi, username);
        return {
            username,
            salt: saltFromApi,
            passwordHash: hash,
            combined
        };
    }, [hashPassword]);

    return {
        registerHash,
        loginHash
    };
};

export default useAuthApi;