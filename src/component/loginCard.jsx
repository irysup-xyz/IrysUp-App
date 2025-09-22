import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import iryslogo from '../assets/irysUplogo.png';
import zorasatu from '../assets/zorasatu.jpg';
import zoradua from '../assets/zoradua.jpg';
import zoratiga from '../assets/zoratiga.jpg';
import useUserApi from '../hooks/useUserApi.js';
import useAuthApi from '../hooks/useAuthApi.js';
import './loginCard.css';

const LoginCard = () => {
    const {
        loading,
        error,
        tryRegister,
        requestLogin,
        register,
        login
    } = useUserApi();

    const { registerHash, loginHash } = useAuthApi();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });

    const [regis, setRegis] = useState(false);
    const [loginMode, setLoginMode] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        password: '',
        confirmPassword: '',
        login: ''
    });

    const images = [zorasatu, zoradua, zoratiga];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleRegis = () => {
        setRegis(true);
        setLoginMode(false);
        setErrors({ name: '', password: '', confirmPassword: '', login: '' });
    };

    const handleLogin = () => {
        setLoginMode(true);
        setRegis(false);
        setErrors({ name: '', password: '', confirmPassword: '', login: '' });
    };

    const handleBack = () => {
        setRegis(false);
        setLoginMode(false);
        setFormData({ name: '', password: '', confirmPassword: '' });
        setErrors({ name: '', password: '', confirmPassword: '', login: '' });
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const isValidUsername = (str) => {
        if (!str) return true;
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(str);
    };

    const isValidPassword = (str) => {
        if (!str) return true;
        const regex = /^[a-zA-Z0-9_\-!@#$%^&*()+=\[\]{}|;:,.<>?]+$/;
        const badChars = /['"\\;\/\x00]/;
        return !badChars.test(str) && regex.test(str);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: '', login: '' }));

        if (name === 'name') {
            if (value.includes(' ')) {
                setErrors(prev => ({ ...prev, name: 'Username cannot contain spaces' }));
            } else if (!isValidUsername(value)) {
                setErrors(prev => ({ ...prev, name: 'Username only allows letters, numbers, _, and -' }));
            } else if (value.trim() === '') {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }

        if (name === 'password') {
            if (!isValidPassword(value)) {
                setErrors(prev => ({ ...prev, password: 'Password contains invalid characters' }));
            } else if (value.trim() === '') {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitRegis = async (e) => {
        e.preventDefault();

        setErrors({ name: '', password: '', confirmPassword: '', login: '' });

        if (!formData.name.trim()) {
            setErrors(prev => ({ ...prev, name: 'Username is required' }));
            return;
        }

        if (formData.name.includes(' ')) {
            setErrors(prev => ({ ...prev, name: 'Username cannot contain spaces' }));
            return;
        }

        if (!isValidUsername(formData.name)) {
            setErrors(prev => ({ ...prev, name: 'Username only allows letters, numbers, _, and -' }));
            return;
        }

        if (!isValidPassword(formData.password)) {
            setErrors(prev => ({ ...prev, password: 'Password contains invalid characters' }));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                password: 'Passwords do not match',
                confirmPassword: 'Passwords do not match'
            }));
            return;
        }

        if (formData.password.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
            return;
        }

        try {
            const tokenResponse = await tryRegister(formData.name);
            if (!tokenResponse?.token) {
                throw new Error("Server did not return a valid token.");
            }

            const result = await registerHash(formData.name, formData.password);

            const registerResult = await register({
                name: result.username,
                regisData: result.passwordHash,
                address: result.salt,
                token: tokenResponse.token
            });

            console.log("🎉 Registration successful! You may now log in.");
            handleBack();
        } catch (err) {
            console.error("[Registration Error]", err);

            let serverMessage = '';
            if (err.response?.data?.serverMessage) {
                serverMessage = err.response.data.serverMessage;
            } else if (err.response?.data?.message) {
                serverMessage = err.response.data.message;
            } else if (err.message) {
                serverMessage = err.message;
            }

            const msg = serverMessage.toLowerCase();
            const isTaken =
                msg.includes('duplicate') ||
                msg.includes('error') ||
                msg.includes('taken') ||
                msg.includes('exists') ||
                msg.includes('Server');

            if (isTaken) {
                setErrors(prev => ({
                    ...prev,
                    name: 'Username already taken. Please choose another.'
                }));
            } else {
                console.log("Registration failed: " + serverMessage);
                if (serverMessage && serverMessage !== 'Server error') {
                    setErrors(prev => ({
                        ...prev,
                        name: serverMessage
                    }));
                }
            }
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        setErrors({ name: '', password: '', confirmPassword: '', login: '' });

        if (!formData.name.trim()) {
            setErrors(prev => ({ ...prev, name: 'Username is required' }));
            return;
        }

        if (!formData.password.trim()) {
            setErrors(prev => ({ ...prev, password: 'Password is required' }));
            return;
        }

        if (!isValidUsername(formData.name)) {
            setErrors(prev => ({ ...prev, name: 'Username only allows letters, numbers, _, and -' }));
            return;
        }

        if (!isValidPassword(formData.password)) {
            setErrors(prev => ({ ...prev, password: 'Password contains invalid characters' }));
            return;
        }

        try {
            const loginResponse = await requestLogin(formData.name);

            if (!loginResponse?.token) {
                throw new Error("No token received from server.");
            }

            const saltFromApi = loginResponse.data?.address;
            if (!saltFromApi) {
                throw new Error("Salt not found in response.");
            }

            const result = await loginHash(formData.name, formData.password, saltFromApi);

            const loginResult = await login({
                name: formData.name,
                regisData: result.passwordHash,
                token: loginResponse.token
            });

            if (loginResult && loginResult.token) {
                const tokenExp = Date.now() + 24 * 60 * 60 * 1000;

                localStorage.setItem('userToken', loginResult.token);
                localStorage.setItem('userData', JSON.stringify({
                    data: loginResult.data
                }));
                localStorage.setItem('tokenExp', tokenExp.toString()); 
            };

            console.log("✅ Login successful!");
            if (!loading) {
                window.location.href = '/home';
            }

        } catch (err) {
            console.error("[Login Error]", err);

            const msg = err.message?.toLowerCase() || '';
            if (
                msg.includes('invalid') ||
                msg.includes('credentials') ||
                msg.includes('not found') ||
                msg.includes('wrong') ||
                msg.includes('unauthorized')
            ) {
                setErrors(prev => ({ ...prev, login: 'Invalid username or password' }));
            } else {
                console.log("Login failed: " + (err.message || "Unknown error"));
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card-left">
                <img
                    src={images[currentImageIndex]}
                    alt="Slide"
                    className="login-slide-img"
                />
            </div>
            <div className="login-card-right">
                {!regis && !loginMode && (
                    <div className="welcome-section">
                        <img src={iryslogo} alt="irysuplogo.png" />
                        <h1 className="welcome-title">Welcome to IrysUp</h1>
                        <p className="welcome-subtitle">
                            The ultimate home for Irys content creators — where your creativity shines and community grows.
                        </p>
                    </div>
                )}

                {!regis && !loginMode && (
                    <>
                        <button className="regis-btn" onClick={handleRegis}>
                            Register
                        </button>
                        <button className="login-btn" onClick={handleLogin}>
                            Login
                        </button>
                        <div className="default-message">
                            <p>Join or sign in to start your journey</p>
                        </div>
                    </>
                )}

                {regis && (
                    <div className="form-container">
                        <button className="back-btn" onClick={handleBack}>← Back</button>
                        <h3>Create Your IrysUp Account</h3>
                        <form onSubmit={handleSubmitRegis}>
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    key={errors.name}
                                    id="username"
                                    name="name"
                                    type="text"
                                    placeholder="Choose a unique username"
                                    autoComplete="username"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={errors.name ? 'input-error' : ''}
                                    onFocus={() => setErrors(prev => ({ ...prev, name: '' }))}
                                />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password (min. 6 chars)"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={errors.password ? 'input-error' : ''}
                                        onFocus={() => setErrors(prev => ({ ...prev, password: '' }))}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-type your password"
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={errors.confirmPassword ? 'input-error' : ''}
                                        onFocus={() => setErrors(prev => ({ ...prev, confirmPassword: '' }))}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Processing...' : 'Register Now'}
                            </button>
                        </form>
                    </div>
                )}

                {loginMode && (
                    <div className="form-container">
                        <button className="back-btn" onClick={handleBack}>← Back</button>
                        <h3>Welcome Back to IrysUp</h3>
                        <form onSubmit={handleSubmitLogin}>
                            <div className="input-group">
                                <label htmlFor="login-username">Username</label>
                                <input
                                    id="login-username"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={errors.name || errors.login ? 'input-error' : ''}
                                    onFocus={() => setErrors(prev => ({ ...prev, name: '', login: '' }))}
                                />
                                {(errors.name || errors.login) && <p className="error-message">{errors.name || errors.login}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="login-password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="login-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Your password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={errors.password || errors.login ? 'input-error' : ''}
                                        onFocus={() => setErrors(prev => ({ ...prev, password: '', login: '' }))}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {(errors.password || errors.login) && <p className="error-message">{errors.password || errors.login}</p>}
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginCard;